var extend = require('extend');
var queue = require('queue');
var promiseify = require('promiseify');

//extend(targetObject, object1, object2);

/*can be set to calc drawing and offset  using ideas from
http://2e5.com/plotter/V/design/ so set machine size and
tell it the aspectratio (that of the camera) and it will
 maximise the effective working area
aspect_ratio :  16/9 */

var PolarMaths = module.exports = function PolarMaths(options) {
  this.q = queue({
    concurrency: 1,
    autostart: true
  });
  this.q.on('success', function(result, job) {
    //console.log('job finished processing:', job.toString().replace(/\n/g, ''))
  });

  options = options || {};

  this.dimensions_mm = {
    machine: {
      x: 4000,
      y: 2000
    },
    drawing: {
      x: 2000,
      y: 1200
    },
    offset: {
      x: 1000,
      y: 400
    },
    wheel_circumference: 94.25,
    min_move: 1
  };
  this.steps_per_rev = 200;
  this.image_size = {
    x: 600,
    y: 400
  };
  this.steps_per_sec = 200;
  this.motor_directions = {
    l: 1,
    r: -1
  }
  this.live = false;


  extend(true, this, options);

  if (this.live) {
    this.motorHat = require('motor-hat')({
      steppers: [{
        W1: 'M1',
        W2: 'M2'
      }]
    }).init();


    this.motors = {
      left: this.motorHat.steppers[0],
      right: this.motorHat.steppers[1]
    };
    this.motors.l.setSpeed({
      sps: this.steps_per_sec
    });
    this.motors.r.setSpeed({
      sps: this.steps_per_sec
    });
    this.motors.l.stepP = promiseify(this.motors.l.step);
    this.motors.r.stepP = promiseify(this.motors.r.step);
  }
};

PolarMaths.prototype.setup_machine = function() {
  //console.log("org", this);
  this.machine_pos = {
    x: 0,
    y: this.dimensions_mm.machine.y
  };
  this.steps_per_mm = this.steps_per_rev / this.dimensions_mm.wheel_circumference;
  this.pixel_mm = {
    x: this.dimensions_mm.drawing.x / this.image_size.x,
    y: this.dimensions_mm.drawing.y / this.image_size.y
  };

  console.log("after", this);
  this.steps_pos = this.get_steps_pos(this.machine_pos);
  //console.log("steps", this.steps_pos);

};

PolarMaths.prototype.get_machine_pos = function(drawing) {
  var mac = {
    x: (drawing.x * this.pixel_mm.x) + this.dimensions_mm.offset.x,
    y: (drawing.y * this.pixel_mm.y) + this.dimensions_mm.offset.y
  };
  console.log("get_machine_pos drawing", drawing, "mac", mac);
  return mac;
};

PolarMaths.prototype.start_machine = function() {
  var drawing_start = {
    x: 0,
    y: this.image_size.y
  };
  this.move_to(drawing_start);
};

PolarMaths.prototype.getDelta = function(posA, posB) {
  var delta = {
    l: posB.l - posA.l,
    r: posB.r - posA.r
  };
  return delta;
};

PolarMaths.prototype.getDeltaMM = function(posA, posB) {
  var delta = {
    x: posB.x - posA.x,
    y: posB.y - posA.y
  };
  return delta;
};

PolarMaths.prototype.start_steps = function(motor, delta) {
  var dir = "fwd";
  delta = delta * this.motor_directions[motor];
  if (delta < 0) {
    dir = "back";
  }
  var steps = Math.abs(delta);
  if (steps == 0 || !this.live) {
    return new Promise((resolve, reject) => {
      resolve({
        motor: motor,
        dir: dir,
        steps: steps,
        duration: 0,
        retried: 0
      });
    });
  }
  return this.motors.l.stepP(dir, steps);
};

//Add coords to a queue,
PolarMaths.prototype.end_step = function(results) {
  ////console.log("end_step", results);
  results.forEach(function(result) {
    //console.log(`${result.motor} did ${result.steps} steps ${result.dir} in ${result.duration/1000} seconds. I had to retry ${result.retried} steps.`);
  });
};

PolarMaths.prototype.fail_step = function(err) {
  if (err) {
    return console.log('Oh no, there was an error', err);
  }
};

PolarMaths.prototype.move_to = function(coord) {
  console.log("move_to", coord);
  var new_pos = this.get_steps_from_drawing(coord);
  var steps_delta = this.getDelta(this.steps_pos, new_pos);
  var job = function() {
    return Promise.all([
      this.start_steps("l", steps_delta.l),
      this.start_steps("r", steps_delta.r)
    ]).then(this.end_step).catch(this.fail_step);
  };

  this.q.push(job.bind(this));

  this.steps_pos = new_pos;
  this.draw_pos = coord;
  console.log("move_to draw_pos", this.draw_pos ,"steps_pos", this.steps_pos, "steps_delta", steps_delta);

};


PolarMaths.prototype.draw_to = function(coord) {
  console.log("draw_to", coord);
  /*//turn light on as promise or callback
  just a http call to the other server.
    */

  var curr_pos = {
    x: this.draw_pos.x,
    y: this.draw_pos.y
  };
  var drawing_delta = this.getDeltaMM(curr_pos, coord);
  var biggest = Math.floor(
    Math.max(Math.abs(drawing_delta.x), Math.abs(drawing_delta.y)) / this.dimensions_mm.min_move
  );
  console.log("draw_to drawing_delta", drawing_delta, " biggest", biggest);

  if (biggest) {
    for (var i = 1; i <= biggest; i++) {
      var point = curr_pos;
      point.x = point.x + ((drawing_delta.x / biggest) * i);
      point.y = point.y + ((drawing_delta.y / biggest) * i);
      this.move_to(point);
    }
  }
  /*//turn light off as Promise
  this.q.push(
    new Promise
    */

  this.draw_pos = coord;
};


PolarMaths.prototype.get_steps_from_drawing = function(drawing) {
  //console.log("get_steps_from_drawing drawing", drawing);
  return this.get_steps_pos(this.get_machine_pos(drawing));
};

PolarMaths.prototype.steps_from_mm = function(mm) {
  //console.log("steps_from_mm", mm);
  return Math.round(mm * this.steps_per_mm);
};
//Should be able to get drawing size from machine size and image dimensions

//Get to start pos (bottom left of image?)
PolarMaths.prototype.get_steps_pos = function(machine) {
  var steps = {
    l: this.steps_from_mm(Math.sqrt((machine.x * machine.x) + (machine.y * machine.y))),
    r: this.steps_from_mm(Math.sqrt(((this.dimensions_mm.machine.x - machine.x) * (this.dimensions_mm.machine.x - machine.x)) + (machine.y * machine.y)))
  };
  //console.log("get_steps_pos machine", machine, "steps", steps);
  return steps;
};

var oPolarMaths = new PolarMaths();
oPolarMaths.setup_machine();
oPolarMaths.start_machine();

oPolarMaths.move_to({
  x: 100,
  y: 100
});
oPolarMaths.draw_to({
  x: 200,
  y: 100,
  color: {
    r: 255,
    g: 0,
    b: 0
  },
  width: 1
});
oPolarMaths.draw_to({
  x: 200,
  y: 200,
  color: {
    r: 0,
    g: 255,
    b: 0
  },
  width: 2
});
oPolarMaths.draw_to({
  x: 100,
  y: 200,
  color: {
    r: 0,
    g: 0,
    b: 255
  },
  width: 3
});
oPolarMaths.draw_to({
  x: 100,
  y: 100,
  color: {
    r: 255,
    g: 255,
    b: 0
  },
  width: 4
});
oPolarMaths.move_to({
  x: 0,
  y: 0
});
//console.log(oPolarMaths.get_steps_pos());

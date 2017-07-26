//nema mount
nema_width      = 35.2;
nema_screw_dist = 26;
nema_screw_dia  = 3.4;
nema_indent_dia = 22.5;
plate_thickness = 3;
wall_height     = 10;

plate_width     = nema_width+(plate_thickness*2);
clamp_height    = 30; 
tube_dia        = 35;
clamp_wall      = 5;
clamp_length     = plate_width;
clamp_width = tube_dia+ (clamp_wall*2) ;
nut_width = 17;
nut_depth = 4;
bolt_dia  = 9;



union(){
    //nema plate
    translate([plate_width/2,0,5]){
        difference(){
            
            cube([plate_width, plate_width, wall_height],center=true);
            
            translate([0,0,2]){
                cube([nema_width, nema_width,wall_height],center=true);
            }
            
            cylinder(r=nema_indent_dia/2,h=wall_height, center=true);
            
            
            for(angle = [0:90:300]){
                rotate(a = angle){
                    translate([nema_screw_dist/2,nema_screw_dist/2,0]){
                        cylinder(r=nema_screw_dia/2,h=wall_height, center=true);
                    }
                }
            }
        }
    }

    
    //clamp
    translate([plate_thickness-(clamp_width/2), 0, clamp_height/2]){
        
        difference(){
            
            cube([clamp_width, clamp_length, clamp_height], center=true);
            
            rotate([0, 0, 90]){
                cylinder(r=tube_dia/2, h=plate_width, center=true);
            }
            translate([0, tube_dia/2, 0]){
                cube([tube_dia, tube_dia, clamp_height], center=true);
            }
            
        
            translate([ -(tube_dia/2
        ), bolt_dia/2,0]){
            rotate([45,0,0]){
                cube([nut_depth*2, nut_width,  nut_width], center=true);
            }
           rotate([0,90,0]){     
                cylinder(r=bolt_dia/2,h=clamp_wall*3, center=true);
            
            }
        }
            
        }
    }




}
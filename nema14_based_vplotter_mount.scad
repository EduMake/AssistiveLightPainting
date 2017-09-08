//nema mount
nema_width      = 35.2;
nema_screw_dist = 26;
nema_screw_dia  = 3.4;
nema_indent_dia = 22.5;
plate_thickness = 2;
wall_height     = 6;

plate_width     = nema_width+(plate_thickness*2);
 
tube_dia        = 30.5;
clamp_inner      = 3;
clamp_outer      = 5.5;
nut_width = 13.5;
nut_depth = 3.5;
bolt_dia  = 9;


clamp_length     = (nut_width*sqrt(2))+(2*clamp_inner);//plate_width;
clamp_width = tube_dia+ clamp_inner + clamp_outer ;

clamp_height    = tube_dia+(clamp_outer*2);//clamp_width;//30;




union(){
    //nema plate
    translate([plate_width/2,0,wall_height/2]){
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
    translate([plate_thickness -(clamp_width/2), 0, clamp_height/2]){
        
        difference(){        
            cube([clamp_width, clamp_length, clamp_height], center=true);
            translate([(clamp_outer-clamp_inner)/2,0,0]){
            rotate([90, 0, 0]){
                cylinder(r=tube_dia/2, h=plate_width, center=true);
            }
            
            rotate([0, -7, 0]){
            translate([0, 0, tube_dia*0.53]){
                
                    cube([tube_dia
                , clamp_width, tube_dia], center=true);
                }
            }
        
            //Captive nut
            translate([ -(tube_dia/2
        ), 0,0]){
                rotate([45,0,0]){
                    cube([nut_depth*2.2, nut_width,  nut_width], center=true);
                }
                rotate([0,90,0]){     
                    cylinder(r=bolt_dia/2,h=clamp_outer*3, center=true);
                }
            }
        }
            translate([0, 0, clamp_outer+(tube_dia/2)]){
                cube([clamp_width, clamp_height, clamp_outer*3], center=true);
            }
        
    }
    }
}
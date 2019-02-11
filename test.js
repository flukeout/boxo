  var physicsObjects = [];
  var torso, mid, base, head;
  var worldCategory = 0x0001,
      foreArmCategory = 0x0002,
      torsoCategory = 0x0003,
      defaultCategory = 0x0004,
      testCategory = 0x0005,
      playerOneCategory = 0x0006,
      playerTwoCategory = 0x0007;
    var one, two;


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

  document.addEventListener('DOMContentLoaded', function () {

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showAngleIndicator: false,
            wireframes: false
        }
    });

    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);


    one = createFighter(250, -2, true);
    two = createFighter(560, -1, false);

    World.add(world, physicsObjects);

    // Ground
    World.add(world, [
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true, collisionFilter : { category: worldCategory } }),
    ]);

    // Add mouse controls for debugging
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: .4,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    render.mouse = mouse;

    loop();
});


let joystick = {
  left : false,
  right : false, 
  up : false,
  down : false,
  punch : false,
  jab : false
}

window.addEventListener("keydown",(e) => {
  console.log(e.keyCode);

  if(e.keyCode == 37) {
    joystick.left = true;
  }

  if(e.keyCode == 65) {
    joystick.jab = true;
  }

  if(e.keyCode == 39) {
    joystick.right = true;
  }

  if(e.keyCode == 38) {
    joystick.up = true;
  }

  if(e.keyCode == 40) {
    joystick.down = true;
  }

  if(e.keyCode == 32) {
    joystick.punch = true;
  }
})

window.addEventListener("keyup",(e)=>{
  if(e.keyCode == 65) {
    joystick.jab = false;
  }


  if(e.keyCode == 37) {
    joystick.left = false;
  }

  if(e.keyCode == 39) {
    joystick.right = false;
  }

  if(e.keyCode == 38) {
    joystick.up = false;
  }

  if(e.keyCode == 40) {
    joystick.down = false;
  }

  if(e.keyCode == 32) {
   joystick.punch = false;
  }
});


window.addEventListener("mousedown",() => {});

window.addEventListener("mouseup",() => {});

function applyRotation(strength, obj){
  obj.torque = strength / 2;
}

const loop = () => {
  one.run();
  two.run();
  window.requestAnimationFrame(loop);
}

planck.testbed(function(testbed) {
  var pl = planck, Vec2 = pl.Vec2, Math = pl.Math;
  var world = planck.World();

  var ground = world.createBody({
    type: 'static',
    position: Vec2(0, -4),
  });

  ground.createFixture({
    shape: pl.Edge(Vec2(-40.0, 0.0),Vec2(40.0, 0.0))
  });

  var ballFixDef = {
    friction: 0.1,
    restitution: 0.99,
    density: 1,
    userData: 'ball'
  };

  var ballBodyDef = {
    linearDamping: 1.5,
    angularDamping: 1
  };
  
  var ball = world.createDynamicBody(ballBodyDef);
  ball.createFixture(pl.Circle(2), ballFixDef);
  ball.setPosition(Vec2(0,0));

  var upperArm = world.createBody({
    type: 'dynamic',
    position: Vec2(0, 12),
  });

  upperArm.createFixture(pl.Box(2, 5), {
    density : .2,
    friction : 0
  });

  var shoulderDefinition = {};
  shoulderDefinition.enableMotor = false;
  shoulderDefinition.maxMotorTorque = 1000.0;
  shoulderDefinition.enableLimit = true;
  shoulderDefinition.motorSpeed = 0.0;
  shoulderDefinition.lowerAngle = -90.0 * Math.PI / 180.0;
  shoulderDefinition.upperAngle = 90.0 * Math.PI / 180.0;

  var leftJoint = pl.RevoluteJoint(
    shoulderDefinition, 
    ground, 
    upperArm, 
    Vec2(0,15)
  );
  
  world.createJoint(leftJoint);

  var lowerArm = world.createBody({
    type: 'dynamic',
    position: Vec2(0, 12),
  });

  var elbowDefinition = {};
  elbowDefinition.enableMotor = false;
  elbowDefinition.maxMotorTorque = 1000.0;
  elbowDefinition.enableLimit = true;
  elbowDefinition.motorSpeed = 20;
  elbowDefinition.lowerAngle = -1.0 * Math.PI / 180.0;
  elbowDefinition.upperAngle = 90.0 * Math.PI / 180.0;

  lowerArm.createFixture(pl.Box(2, 5), {
    density : .2,
    friction : 0
  });


  var rightJoint = pl.RevoluteJoint(
    elbowDefinition, 
    upperArm, 
    lowerArm, 
    Vec2(0,8)
  );
  
  world.createJoint(rightJoint);

  // rest of your code
  return world; // make sure you return the world
});
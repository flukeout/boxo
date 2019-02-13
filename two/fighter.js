const createFighter = (x, group, move, direction) => {

    let filter = { 
         group : group,
         mask : 0x0005
      };

    // x, y, width, height
    let torso = Bodies.rectangle(100, 400, 100, 150, { 
      collisionFilter: filter,
      frictionAir : .2,
      mass: 50,
      label: "torso",
      chamfer : {radius: [50,50,50,50]}
    });



    let mid = Bodies.rectangle(400, 200, 100, 150, { 
        collisionFilter: filter ,
        label: "torso",
        chamfer : {radius: [20,20,0,0]}
    });

    let upperArm = Bodies.rectangle(500, 400, 75, 150,  { 
        collisionFilter: filter,
        frictionAir : 0,
        label: "upperarm",
        density: .005
    });


    let lowerArm = Bodies.rectangle(500, 400, 75, 150, { 
      collisionFilter: filter,
      mass : 5,
      friction: 1,
      frictionAir : .1,
      label: "upperarm",
      chamfer : {radius: [0,0,30,30]},
    });


    // Shoulder constraint
    let elbowConstraint = Constraint.create({
      bodyA: upperArm,
      pointA: { x: 0, y: 75 },
      bodyB: lowerArm,
      pointB: { x: 0, y: -75 },
      stiffness : 1,
      length: 0
    });


    // Shoulder constraint
    let punchConstraint = Constraint.create({
      bodyA: lowerArm,
      pointA: { x: 0, y: 35 },
      pointB: { x: 600, y: 200 },
      stiffness : .0001,
      length: 10
    });

    physicsObjects.push(punchConstraint);




    // let elbowLimiter = Constraint.create({
    //   bodyA: upperArm,
    //   pointA: { x: -40, y: 65 },
    //   bodyB: lowerArm,
    //   pointB: { x: -40, y: -65 },
    //   stiffness : .001,
    //   length: 100
    // });
    // details.elbowLimiter = elbowLimiter;

    // physicsObjects.push(elbowLimiter);


    let elbowAngleConstraint = Constraint.create({
      bodyA: upperArm,
      pointA: { x: 30, y: -40 },
      bodyB: lowerArm,
      pointB: { x: 30, y: 40 },
      stiffness : .01,
      length: 125
    });


    // Shoulder constraint
    let shoulderConstraint = Constraint.create({
      bodyA: torso,
      pointA: { x: 0, y: -50 },
      bodyB: upperArm,
      pointB: { x: 0, y: -75 },
      stiffness : .2,
      length: 0
    });

    let head = Bodies.rectangle(400, 200, 150, 150, { 
      collisionFilter: filter ,
      density : .0001,
      friction : 1,
      frictionAir : 0, 
      restitution : .9,
      chamfer : {radius : 50}
    });

    let nose = Bodies.rectangle(400, 200, 70, 25, { 
      collisionFilter: filter ,
      mass : 3,
      chamfer : {radius : 10}
    });


    // Shoulder constraint
    var noseConstraint = Constraint.create({
      bodyA: head,
      pointA: direction == "right" ? { x: 50, y: 0 } : { x: -50, y: 0 },
      bodyB: nose,
      pointB: direction == "right" ? { x: -35, y: 0 } : { x: 35, y: 0 },
      stiffness : .5,
      length: 0
    });

    // Shoulder constraint
    var noseConstraintTwo = Constraint.create({
      bodyA: head,
      pointA: direction == "right" ? { x: 70, y: 0 } : { x: -70, y: 0 },
      bodyB: nose,
      pointB: direction == "right" ? { x: -15, y: 0 } : { x: 15, y: 0 },
      stiffness : .5,
      length: 0
    });
 

    let base = Bodies.rectangle(x, 550, 150, 50, { 
      collisionFilter: filter,
      isStatic: true,
      frictionAir : .1
    });

    // Shoulder constraint
    var baseConstraint = Constraint.create({
      bodyA: base,
      pointA: { x: -30, y: -25 },
      bodyB: mid,
      pointB: { x: -30, y: 75 },
      stiffness : .5,
      length: 0
    });

    // Shoulder constraint
    var baseConstraintTwo = Constraint.create({
      bodyA: base,
      pointA: { x: 30, y: -25 },
      bodyB: mid,
      pointB: { x: 30, y: 75 },
      stiffness : .5,
      length: 0
    });

    let headConstraintOne = Constraint.create({
      bodyA: head,
      pointA: { x: -15, y: 70 },
      bodyB: torso,
      pointB: { x: -15, y: -100 },
      stiffness : .2,
      length: 0
    });

    let headConstraintTwo = Constraint.create({
      bodyA: head,
      pointA: { x: 15, y: 70 },
      bodyB: torso,
      pointB: { x: 15, y: -100 },
      stiffness : .2,
      length: 0
    });

    let midTorsoConstraint = Constraint.create({
      bodyA: torso,
      pointA: { x: 30, y: 75 },
      bodyB: mid,
      pointB: { x: 30, y: -75 },
      stiffness : .2,
      length: 0
    });

    let midTorsoConstraintTwo = Constraint.create({
      bodyA: torso,
      pointA: { x: -30, y: 75 },
      bodyB: mid,
      pointB: { x: -30, y: -75 },
      stiffness : .2,
      length: 0
    });


    let details = {
      shoulderMuscle : new Controller({
        k_p: 2,
        k_d: 1,
        k_i: .05,
        dt: 1
      }),
      elbowMuscle : new Controller({
        k_p: 40,
        k_d: 40,
        k_i: .1,
        dt: 1
        // k_p: 60,
        // k_d: 10,
        // k_i: .1,
        // dt: 1
      }),

      parts : {
        torso : torso,
        upperArm : upperArm,
        lowerArm : lowerArm,
        elbowAngleConstraint : elbowAngleConstraint,
        punchConstraint : punchConstraint,
        head : head,
        base : base
      },
      shoulderAngles : {
        up : -2.25,
        neutral : -1.75,
        down : -.25 
      },
      shoulderTarget : false,
      elbowAngles : {
        up : -2.2,
        neutral : -2.2,
        down : -2.2,
        jab : 0
      },
      elbowTarget : false,
      shoulderTarget : false,
      reset : false,
      move : move,
      punchStatus : "neutral",
      punchType : "uppercut",


      adjustMusclePower : function() {
        if(this.punchStatus == "windup") {
           this.shoulderMuscle.k_p = 30;
           this.shoulderMuscle.k_d = 16;
           this.shoulderMuscle.k_i = .01;
        } else if (this.punchStatus == "neutral") {
           this.shoulderMuscle.k_p = 32;
           this.shoulderMuscle.k_d = 120;
           this.shoulderMuscle.k_i = 0.05;
        } else if (this.punchStatus == "release" && this.punchType == "straight") {
           this.shoulderMuscle.k_p = 82;
           this.shoulderMuscle.k_d = 40;
           this.shoulderMuscle.k_i = 0.05;
        } else {
           this.shoulderMuscle.k_p = 40;
           this.shoulderMuscle.k_d = 20;
        }
      },

      run : function() {

        if(this.move == false) {
          return;
        }

        // Update muscle strength based on what's going on
        this.adjustMusclePower();

        let lowerArmAngle =  this.parts.lowerArm.angle - this.parts.upperArm.angle;
        // let upperArmAngle =  this.parts.upperArm.angle - this.parts.torso.angle;
        let upperArmAngle =  this.parts.upperArm.angle;

        // Limits upper arm angle rotation
        if(upperArmAngle > 1 || upperArmAngle < -4) {
          Matter.Body.setAngularVelocity(
            this.parts.upperArm, .8 * this.parts.upperArm.angularVelocity
          );
        }

        if(joystick.left) {
            Matter.Body.applyForce(this.parts.torso, {
              x : this.parts.torso.position.x, 
              y : this.parts.torso.position.y },{
              x : -.5 , 
              y: 0
            });
        }

        if(joystick.right) {
          Matter.Body.applyForce(this.parts.torso, {
            x : this.parts.torso.position.x,
            y : this.parts.torso.position.y },{
            x : .5 , y: 0
          });
        }


        if(this.punchStatus == "neutral") {
          if (joystick.up) {
            // Up
            if(this.shoulderTarget != this.shoulderAngles.up) {
              this.shoulderTarget = this.shoulderAngles.up;
              this.shoulderMuscle.setTarget(this.shoulderTarget);
            }
            if(this.elbowTarget != this.elbowAngles.up) {
              this.elbowTarget = this.elbowAngles.up;
              this.elbowMuscle.setTarget(this.elbowTarget);
            }
          } else if (joystick.down) {
            // Down
            if(this.shoulderTarget != this.shoulderAngles.down) {
              this.shoulderTarget = this.shoulderAngles.down;
              this.shoulderMuscle.setTarget(this.shoulderTarget);
            }
            if(this.elbowTarget != this.elbowAngles.down) {
              this.elbowTarget = this.elbowAngles.down;
              this.elbowMuscle.setTarget(this.elbowTarget);
            }
          } else {
            // Neutral
            if(this.shoulderTarget != this.shoulderAngles.neutral) {
              this.shoulderTarget = this.shoulderAngles.neutral;
              this.shoulderMuscle.setTarget(this.shoulderTarget);
            }
            if(this.elbowTarget != this.elbowAngles.neutral) {
              this.elbowTarget = this.elbowAngles.neutral;
              this.elbowMuscle.setTarget(this.elbowTarget);
            }

          }
        }

        if(this.punchStatus == "neutral") {

          if(joystick.z) {
              this.punchStatus = "windup";
              this.punchType = "uppercut";
              this.shoulderTarget = 2;
              this.shoulderMuscle.setTarget(this.shoulderTarget);
              console.log("Punch - windup -", this.punchType);
          } else if (joystick.x) {
              this.punchStatus = "windup";
              this.punchType = "straight";
              this.shoulderTarget = 0;
              this.shoulderMuscle.setTarget(this.shoulderTarget);
              console.log("Punch - windup -", this.punchType);
          }
        }

        if(this.punchStatus == "windup") {
          if(joystick.z == false && this.punchType == "uppercut") {
              this.punchStatus = "release";
              this.shoulderTarget = this.shoulderAngles.up;
              this.shoulderMuscle.setTarget(this.shoulderTarget);
              console.log("Punch - release", this.punchType);
              let that = this;
              setTimeout(function(){
                that.punchStatus = "neutral";
                console.log("Punch - neutral");
              }, 200);
          }
          if(joystick.x == false && this.punchType == "straight") {
              this.punchStatus = "release";
              // this.shoulderTarget = -3;
              // this.shoulderMuscle.setTarget(this.shoulderTarget);

              // let that = this;

              // setTimeout(function(){
              //   that.elbowTarget = 0;
              //   that.elbowMuscle.setTarget(that.elbowTarget);
              // }, 130);


              console.log("Punch - release", this.punchType);
              let that = this;
              setTimeout(function(){
                that.punchStatus = "neutral";
                that.parts.punchConstraint.stiffness = .00001;
                console.log("Punch - neutral");
              }, 350);
          }

        }

        if(joystick.z == true && this.punchStatus == "release") {
          this.punchStatus = "neutral";
          console.log("Punch - neutral");
        }

        if(this.punchType == "straight" && this.punchStatus == "release") {
          if(upperArmAngle < -1.4) {
            Matter.Body.setAngularVelocity(
              this.parts.upperArm, .5 * this.parts.upperArm.angularVelocity
            );
          }
        }


        // if(joystick.punch) {
        //   if(this.punchStatus == "neutral") {
        //     this.shoulderTarget = 2;
        //     this.shoulderMuscle.setTarget(this.shoulderTarget);
        //     this.punchStatus = "windup";
        //   }
        // } else {
        //   if(this.punchStatus == "windup"){
        //     this.punchStatus = "neutral";
        //   }
        // }

        if(this.punchStatus == "release" && this.punchType == "straight") {
          console.log("free me!");
            this.parts.punchConstraint.stiffness = .02
        } else {

          let input = this.shoulderMuscle.update(upperArmAngle);
          applyRotation(input, this.parts.upperArm);

          input = this.elbowMuscle.update(lowerArmAngle);
          applyRotation(input, this.parts.lowerArm);

        }


      }
    };

    // physicsObjects.push(elbowAngleConstraint);
    physicsObjects.push(nose);
    physicsObjects.push(noseConstraint)
    physicsObjects.push(noseConstraintTwo)
    physicsObjects.push(head);
    physicsObjects.push(midTorsoConstraintTwo);
    physicsObjects.push(midTorsoConstraint);
    physicsObjects.push(shoulderConstraint);
    physicsObjects.push(base);
    physicsObjects.push(mid);
    physicsObjects.push(baseConstraint);
    physicsObjects.push(baseConstraintTwo);
    physicsObjects.push(headConstraintTwo);
    physicsObjects.push(headConstraintOne);
    physicsObjects.push(elbowConstraint);
    physicsObjects.push(torso);
    physicsObjects.push(upperArm);
    physicsObjects.push(lowerArm);

    details.run();

    return details;

}
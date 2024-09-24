var TurretControl = pc.createScript('turretControl');

// Add the bullet template as an attribute in the PlayCanvas editor
TurretControl.attributes.add('bulletTemplate', { type: 'entity' });
//console.log('Bullet relative to Camera:', this.app.root.findByName('Camera').getPosition().distance(bullet.getPosition()));


// Initialize the turret control script
TurretControl.prototype.initialize = function() {
    //document.addEventListener("DOMContentLoaded", () => {
        //console.log("TurretControl initialized!");

        // Hide the bullet template initially
        if (this.bulletTemplate) {
            // Ensure it’s not visible
            this.bulletTemplate.enabled = false;
        }

        // Boolean to track whether the right mouse button is pressed
        this.isFiring = false;
        this.fireInterval = 0.2; // Interval between bullet fires (in seconds)
        this.fireTimer = 0;

        this.speed = 60; // rotation speed

        // Ensure the mouse is enabled
        this.app.mouse.enablePointerLock();
        // Prevent right-click menu from appearing
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // Store the previous mouse position to calculate delta
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

        this.isMousePressed = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        // Disable gravity just for testing
        this.entity.rigidbody.applyForce(0, 0, 0);
        
        // Ensure the entity has the collision component
        if (this.entity.collision && this.entity.rigidbody) {
            console.log('Collision initialized! Entity:', this.entity.name);
            
            // Listen for collision events
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        } else {
            console.error('Entity is missing Collision or RigidBody component:', this.entity.name);
        }
    //});
};

// Called when the player presses the mouse
TurretControl.prototype.onMouseDown = function(event) {
    if (event.button === pc.MOUSEBUTTON_LEFT) {
        this.isMousePressed = true;
        this.lastMouseX = event.x; // Store initial mouse X position
        this.lastMouseY = event.y; // Store initial mouse Y position
    }

    // Check if the right mouse button is pressed (pc.MOUSEBUTTON_RIGHT is the right mouse button)
    if (event.button === pc.MOUSEBUTTON_RIGHT) {
        this.isFiring = true;  // Start firing bullets
        this.fireTimer = 0;    // Reset the fire timer
    }
};

// Called when the player moves the mouse
TurretControl.prototype.onMouseMove = function(event) {
    if (this.isMousePressed) {
        // Calculate the horizontal and vertical mouse movement (delta)
        var deltaX = event.x - this.lastMouseX;
        var deltaY = event.y - this.lastMouseY;

        // Yaw rotation (left/right) - rotates around the Y-axis
        this.entity.rotateLocal(0, -deltaX * this.speed * 0.01, 0);

        // Pitch rotation (up/down) - rotates around the X-axis
        this.entity.rotateLocal(-deltaY * this.speed * 0.01, 0, 0);

        // Update the last mouse positions
        this.lastMouseX = event.x;
        this.lastMouseY = event.y;
    }
};

// Called when the player releases the mouse
TurretControl.prototype.onMouseUp = function(event) {
    if (event.button === pc.MOUSEBUTTON_LEFT) {
        this.isMousePressed = false;
    }

    // Stop firing when the right mouse button is released
    if (event.button === pc.MOUSEBUTTON_RIGHT) {
        this.isFiring = false;
    }
};

// Update function to handle firing bullets
TurretControl.prototype.update = function(dt) {
    // Fire bullets (you can customize firing rate and mechanics)
    if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
        //this.fireBullet();
        this.shootBullet();
    }

    // Check if the player is firing bullets
    if (this.isFiring) {
        this.fireTimer += dt; // Increment the fire timer

        // Check if enough time has passed to fire the next bullet
        if (this.fireTimer >= this.fireInterval) {
            this.shootBullet(); // Call your existing bullet firing function
            this.fireTimer = 0; // Reset the timer
        }
    }
};



TurretControl.prototype.shootBullet = function() {
    //console.log('Bullet Template:', this.bulletTemplate);

    if (!this.bulletTemplate) {
        console.error('Bullet template is not assigned! Please check the assignment in the editor.');
        return; // Exit the function if bulletTemplate is null
    }

    // Clone the bullet template
    var bullet = this.bulletTemplate.clone();
    this.app.root.addChild(bullet);

    // Set the bullet to be visible (if it was previously hidden)
    bullet.enabled = true; // Make sure the bullet is enabled

    // Get the turret's position and orientation
    var turretPosition = this.entity.getPosition();

    // Set the bullet's position to the turret's position plus an offset in the forward direction
    var bulletOffset = this.entity.forward.clone().scale(10); // Adjust this offset as needed
    //bullet.setPosition(turretPosition.add(bulletOffset));
    // Ensure bullet spawns in front of the turret
    //bullet.setPosition(turretPosition.x - 0.4, turretPosition.y - 0.4, turretPosition.z - 5);
    //bullet.setPosition(turretPosition.x, turretPosition.y, turretPosition.z);
    bullet.setPosition(turretPosition.add(bulletOffset));
    //console.log(bullet.getPosition());
    bullet.setRotation(this.entity.getRotation()); // Match the bullet's rotation to the turret's rotation


    // Apply impulse to the bullet in the turret's forward direction
    var force = this.entity.forward.clone().scale(200); // Increase force for visibility
    //bullet.rigidbody.applyImpulse(force);
    bullet.rigidbody.applyForce(0, 0, 0);
    // Set the velocity to ensure it travels forward
    bullet.rigidbody.linearVelocity = this.entity.forward.clone().scale(200);

    // Logs
    //console.log('Bullet fired:', bullet.name, 'Position:', bullet.getPosition(), 'Force:', force);
    //console.log('Bullet Velocity after firing:', bullet.rigidbody.linearVelocity);
    //console.log('Turret Position:', turretPosition);
    //console.log('Bullet Offset:', bulletOffset);
    //console.log('Bullet Position after setting:', bullet.getPosition());
};


// Collision event handler
TurretControl.prototype.onCollisionStart = function(result) {
    console.log('Turret collision detected...: ', result.other.name);

    if (result.other.name === 'Meteorite') {
        // TODO: Destroy the meteorite upon collision with the turret

        var gameManager = this.app.root.findByName('GameManager').script.gameManager;

        // Call this when a meteorite hits the turret
        gameManager.onMeteoriteHit();
    }
};

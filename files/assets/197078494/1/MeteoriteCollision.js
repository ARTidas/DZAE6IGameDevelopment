var MeteoriteCollision = pc.createScript('meteoriteCollision');

// Initialize the script
MeteoriteCollision.prototype.initialize = function() {
    //document.addEventListener("DOMContentLoaded", () => {
        //console.log("BulletCollision initialized!");

        // Disable gravity just for testing
        this.entity.rigidbody.applyForce(0, 0, 0);
        
        // Ensure the entity has the collision component
        /*if (this.entity.collision && this.entity.rigidbody) {
            //console.log('BulletCollision initialized! Entity:', this.entity.name);
            
            // Listen for collision events
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        } else {
            console.error('Entity is missing Collision or RigidBody component:', this.entity.name);
        }*/
    //});
};

// Collision event handler
/*MeteoriteCollision.prototype.onCollisionStart = function(result) {
    console.log('Meteorite collision detected...: ', result.other.name);

    if (result.other.name === 'Turret') {
        // Destroy the meteorite upon collision with the turret
        this.entity.destroy();  // Destroy the meteorite

        var gameManager = this.app.root.findByName('GameManager').script.gameManager;

        // Call this when a meteorite hits the turret
        gameManager.onMeteoriteHit();
    }

    //TODO: What to do when meteorite collides with another meteorite?
};*/

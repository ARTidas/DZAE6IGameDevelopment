var BulletCollision = pc.createScript('bulletCollision');

// Initialize the script
BulletCollision.prototype.initialize = function() {
    //document.addEventListener("DOMContentLoaded", () => {
        //console.log("BulletCollision initialized!");

        // Disable gravity just for testing
        this.entity.rigidbody.applyForce(0, 0, 0);
        
        // Ensure the entity has the collision component
        if (this.entity.collision && this.entity.rigidbody) {
            //console.log('BulletCollision initialized! Entity:', this.entity.name);
            
            // Listen for collision events
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        } else {
            console.error('Bullet entity is missing Collision or RigidBody component:', this.entity.name);
        }
    //});
};

// Collision event handler
BulletCollision.prototype.onCollisionStart = function(result) {
    if (result.other.name === 'Meteorite') {
        // Destroy both the bullet and meteorite upon collision
        result.other.destroy(); // Destroy the meteorite
        this.entity.destroy();  // Destroy the bullet

        var gameManager = this.app.root.findByName('GameManager').script.gameManager;

        // Call this when a meteorite is destroyed
        gameManager.onMeteoriteDestroyed();
    }
};

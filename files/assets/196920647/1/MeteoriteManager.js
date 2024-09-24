var MeteoriteManager = pc.createScript('meteoriteManager');

MeteoriteManager.attributes.add('meteoriteTemplate', { type: 'entity' }); // Reference to the meteorite template

MeteoriteManager.prototype.initialize = function() {
    //document.addEventListener("DOMContentLoaded", () => {
        //console.log("MeteoriteManager initialized!");

        // Hide the meteorite template initially
        if (this.meteoriteTemplate) {
            this.meteoriteTemplate.enabled = false;
        }

        this.meteorites = []; // Array to hold active meteorites
        this.maxMeteorites = 20; // Maximum allowed meteorites
        this.spawnRate = 2; // Rate at which meteorites spawn (in seconds)
        this.minDistanceFromPlayer = 50; // Minimum distance from the player
        this.meteoriteSpeed = 2; // Speed at which meteorites move towards the turret
        //this.meteoriteSpeed = 20; // Speed at which meteorites move towards the turret // Testing speed

        this.spawnMeteorite(); // Start spawning meteorites
    //});
};

// Function to spawn a meteorite
MeteoriteManager.prototype.spawnMeteorite = function() {
    if (this.meteorites.length >= this.maxMeteorites) {
        console.log("Maximum meteorite limit reached. Stopping spawn.");
        return; // Stop spawning if the limit is reached
    }

    // Get the player's position (assumed to be the turret's position)
    var playerPosition = this.app.root.findByName('Turret').getPosition();

    var position;
    do {
        // Generate random position for the meteorite
        var x = Math.random() * 100 - 50; // Random x position around the center
        var y = Math.random() * 20 + 10;   // Random y position (above the ground)
        var z = Math.random() * 100 - 50;  // Random z position around the center
        position = new pc.Vec3(x, y, z);
    } while (position.distance(playerPosition) < this.minDistanceFromPlayer); // Ensure it's a minimum distance away from the player

    // Clone the meteorite template
    var meteorite = this.meteoriteTemplate.clone(); // Clone from the meteorite template
    meteorite.setPosition(position); // Set position for the new meteorite
    meteorite.enabled = true; // Make sure the meteorite is enabled

    // Apply a random rotation to the meteorite
    var randomRotationX = Math.random() * 360; // Random rotation around X-axis
    var randomRotationY = Math.random() * 360; // Random rotation around Y-axis
    var randomRotationZ = Math.random() * 360; // Random rotation around Z-axis

    // Set random rotation speeds for the meteorite
    meteorite.rotationSpeed = new pc.Vec3(
        Math.random() * 30 + 20, // Random speed for X-axis (20 to 50)
        Math.random() * 30 + 20, // Random speed for Y-axis (20 to 50)
        Math.random() * 30 + 20  // Random speed for Z-axis (20 to 50)
    );

    // Set the random rotation to the meteorite
    meteorite.setEulerAngles(randomRotationX, randomRotationY, randomRotationZ);


    // Add the meteorite to the scene
    this.app.root.addChild(meteorite);
    this.meteorites.push(meteorite); // Add to the active meteorites array

    //console.log("Meteorite spawned at position: ", position);
    //console.log("Total meteorites: " + this.meteorites.length);

    // Set a timeout to spawn the next meteorite
    setTimeout(this.spawnMeteorite.bind(this), this.spawnRate * 1000);
};

// Update function to move meteorites towards the turret
MeteoriteManager.prototype.update = function(dt) {
    var turret = this.app.root.findByName('Turret');
    if (!turret) return; // If turret is not found, exit

    var turretPosition = turret.getPosition();

    // Clear out destroyed meteorites
    for (var i = this.meteorites.length - 1; i >= 0; i--) {
        if (!this.meteorites[i].enabled) { // If the meteorite is disabled, it's considered destroyed
            this.meteorites.splice(i, 1); // Remove from the array
            console.log("Meteorite destroyed. Total: " + this.meteorites.length);
        }
    }

    // Move each meteorite towards the turret
    for (var i = this.meteorites.length - 1; i >= 0; i--) {
        var meteorite = this.meteorites[i];

        // Calculate direction towards the turret
        var direction = turretPosition.clone().sub(meteorite.getPosition()).normalize(); // Direction vector
        meteorite.translate(direction.scale(this.meteoriteSpeed * dt)); // Move meteorite towards the turret

        // Rotate the meteorite continuously
        var rotation = meteorite.getEulerAngles();
        rotation.x += meteorite.rotationSpeed.x * dt;
        rotation.y += meteorite.rotationSpeed.y * dt;
        rotation.z += meteorite.rotationSpeed.z * dt;
        meteorite.setEulerAngles(rotation.x, rotation.y, rotation.z);

        // Calculate and print the distance between the turret and the meteorite
        var distance = turretPosition.distance(meteorite.getPosition());
        console.log("Dist: ", distance);

        // HACK!!! // TODO: Still have to solve why the collision 
        //  does not work between the Turrent and the Meteorite(s)
        if (distance < 10) {
            // Disable meteorite for the cleanup phase
            meteorite.enabled = false;

            var gameManager = this.app.root.findByName('GameManager').script.gameManager;

            // Call this when a meteorite hits the turret
            gameManager.onMeteoriteHit();
        }
    }
};


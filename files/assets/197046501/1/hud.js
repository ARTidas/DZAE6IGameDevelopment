var Hud = pc.createScript('hud');

Hud.attributes.add('css', {type: 'asset', assetType:'css', title: 'CSS Asset'});
Hud.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});


// initialize code called once per entity
Hud.prototype.initialize = function() {
    // create STYLE element
    var style = document.createElement('style');

    // append to head
    document.head.appendChild(style);
    style.innerHTML = this.css.resource || '';
    
    // Add the HTML
    this.div = document.createElement('div');
    this.div.classList.add('container');
    this.div.innerHTML = this.html.resource || '';
    
    // append to body
    // can be appended somewhere else
    // it is recommended to have some container element
    // to prevent iOS problems of overfloating elements off the screen
    document.body.appendChild(this.div);
    
    this.counter = 0;
    
    this.bindEvents();
};

// update code called every frame
Hud.prototype.update = function(dt) {

};

Hud.prototype.bindEvents = function() {
    var self = this;
    // example
    //
    // get button element by class
    var button = this.div.querySelector('.button');
    var counter = this.div.querySelector('.counter');
    // if found
    if (button) {
        // add event listener on `click`
        button.addEventListener('click', function() {
            ++self.counter;
            if (counter)
                counter.textContent = self.counter;
            
            console.log('button clicked');

            // try to find object and change its material diffuse color
            // just for fun purposes
            var obj = pc.app.root.findByName('box');
            if (obj && obj.render) {
                var material = obj.render.meshInstances[0].material;
                if (material) {
                    material.diffuse.set(Math.random(), Math.random(), Math.random());
                    material.update();
                }
            }
        }, false);
    }

    if (counter)
        counter.textContent = self.counter;
};
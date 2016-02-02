// OpenSeadragon SVG Overlay plugin 0.0.4

(function() {

    if (!window.OpenSeadragon) {
        console.error('[openseadragon-svg-overlay] requires OpenSeadragon');
        return;
    }

    var svgNS = 'http://www.w3.org/2000/svg';

    // ----------
    OpenSeadragon.Viewer.prototype.svgOverlay = function() {
        if (this._svgOverlayInfo) {
            return this._svgOverlayInfo;
        }

        this._svgOverlayInfo = new Overlay(this);
        return this._svgOverlayInfo;
    };

    // ----------
    var Overlay = function(viewer) {
        var self = this;

        this._viewer = viewer;
        this._containerWidth = 0;
        this._containerHeight = 0;
        this._translate = {x: 0, y: 0};
        this._zoom = 0;
        this._scale = 1;
        this._rotate = 0;

        this._svg = document.createElementNS(svgNS, 'svg');
        this._svg.style.position = 'absolute';
        this._svg.style.left = 0;
        this._svg.style.top = 0;
        this._svg.style.width = '100%';
        this._svg.style.height = '100%';
        this._viewer.canvas.appendChild(this._svg);

        this._node = document.createElementNS(svgNS, 'g');
        this._svg.appendChild(this._node);

        this._viewer.addHandler('animation', function() {
            // self.resize_aspect();
            // self.resize();
            self.resize_new();
        });

        this._viewer.addHandler('open', function() {
            // self.resize_aspect();
            // self.resize();
            self.resize_new();
        });

        this._viewer.addHandler('rotate', function() {
            // self.resize_aspect();
            // self.resize();
            self.resize_new();
        });

        // self.resize_aspect();
        // this.resize();
        this.resize_new();
    };

    // ----------
    Overlay.prototype = {
        // ----------
        node: function() {
            return this._node;
        },

        // ----------
        resize: function() {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._svg.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._svg.setAttribute('height', this._containerHeight);
            }

            var p = this._viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
            var zoom = this._viewer.viewport.getZoom(true);
            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
            var scale = this._viewer.viewport._containerInnerSize.x * zoom;
            this._node.setAttribute('transform',
                'translate(' + p.x + ',' + p.y + ') scale(' + scale + ')');
        },

        resize_aspect: function() {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._svg.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._svg.setAttribute('height', this._containerHeight);
            }

            var p = this._viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
            var zoom = this._viewer.viewport.getZoom(true);
            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
            var scaleX = this._viewer.viewport._containerInnerSize.x * zoom;
            var scaleY = this._viewer.viewport._containerInnerSize.y * zoom;
            this._node.setAttribute('transform',
                'translate(' + p.x + ',' + p.y + ') scale(' + scaleX + ', ' + scaleY + ')');
        },

        resize_new: function() {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._svg.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._svg.setAttribute('height', this._containerHeight);
            }

            var p = this._viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
            var zoom = this._viewer.viewport.getZoom(true);
            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
            var scale = this._viewer.viewport.viewportToImageZoom(zoom);
            var rotate = this._viewer.viewport.degrees;
            var containerSize = {width: parseFloat(this._svg.getAttribute('width')), height: parseFloat(this._svg.getAttribute('height'))};
            this._node.setAttribute('transform',
                'rotate(' + rotate +  ', ' + (containerSize.width / 2) + ', ' + (containerSize.height / 2) + ') translate(' + p.x + ',' + p.y + ') scale(' + scale + ')');

            
            this._translate = {x: p.x, y: p.y};
            this._zoom = zoom;
            this._scale = scale;
            this._rotate = rotate;
            
            // console.debug(this.getTransformData());
            $.event.trigger({
                type: "svg.transform",
                transformData : this.getTransformData()
            });
        },

        // ----------
        onClick: function(node, handler) {
            // TODO: Fast click for mobile browsers

            new OpenSeadragon.MouseTracker({
                element: node,
                clickHandler: handler
            }).setTracking(true);
        },
        getTransformData: function() {
            return{
                    translate: this._translate,
                    zoom: this._zoom,
                    scale: this._scale,
                    rotation: this._rotate
                };
        }
    };

})();

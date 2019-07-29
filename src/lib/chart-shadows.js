import Chart from 'chart.js'

// Line shadows
let draw = Chart.controllers.line.prototype.draw;
Chart.controllers.line.prototype.draw = function () {
    draw.apply(this, arguments);
    let ctx = this.chart.chart.ctx;
    let _stroke = ctx.stroke;
    ctx.stroke = function () {
        ctx.save();
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 6;
        _stroke.apply(this, arguments);
        ctx.restore();
    }
};

let pieDraw = Chart.elements.Arc.prototype.draw;
Chart.elements.Arc.prototype.draw = function () {
    var ctx = this._chart.ctx;
    var vm = this._view;
    var sA = vm.startAngle;
    var eA = vm.endAngle;
    // Hover case
    if (this._chart.tooltip._active && this._chart.tooltip._active.length) {
        var vm2 = this._chart.active[0]._view;
        if (vm2 == vm) {
            var sA = vm2.startAngle;
            var eA = vm2.endAngle;
            ctx.beginPath();
            ctx.arc(vm.x, vm.y, vm.outerRadius + 20, sA, eA);
            ctx.arc(vm.x, vm.y, vm.innerRadius + 20, eA, sA, true);
            ctx.closePath();
            ctx.save();

            ctx.fillStyle = vm.backgroundColor;
            ctx.lineWidth = 4;
            ctx.shadowColor = vm.backgroundColor;
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 0;
            ctx.fill();
            ctx.lineJoin = 'bevel';
            ctx.restore();
            return 
        }
    } 

    // Standard case
    ctx.beginPath();
    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
    ctx.closePath();
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = vm.borderWidth;
    ctx.fillStyle = vm.backgroundColor;
    ctx.fill();
    ctx.lineJoin = 'bevel';
    ctx.stroke();
    
};
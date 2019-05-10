
import * as Chartist from 'chartist';

function AutoScaleAxis(axisUnit, data, chartRect, options) {

    var scale = options.scale || 'linear';
    var match = scale.match(/^([a-z]+)(\d+)?$/);
    this.scale = {
        type: match[1],
        base: Number(match[2]) || 10,
    }

    if (this.scale.type === 'log') {
        var highLow = options.highLow || getLogAxisHighLow(data, options, axisUnit.pos);
        this.bounds = getLogAxisBounds(chartRect[axisUnit.rectEnd] - chartRect[axisUnit.rectStart],
            highLow, options.scaleMinSpace || 20, options.onlyInteger, this.scale.base);
    }
    else {
        // Usually we calculate highLow based on the data but this can be 
        // overriden by a highLow object in the options
        var highLow = options.highLow || Chartist.getHighLow(data, options, axisUnit.pos);
        this.bounds = Chartist.getBounds(chartRect[axisUnit.rectEnd] - chartRect[axisUnit.rectStart],
            highLow, options.scaleMinSpace || 20, options.onlyInteger);
    }

    Chartist.AutoScaleAxis.super.constructor.call(this,
        axisUnit,
        chartRect,
        this.bounds.values,
        options);
}

let c = <any>Chartist;
c.AutoScaleAxis = Chartist.Axis.extend({
    constructor: AutoScaleAxis,
    projectValue: logAxisProjectValue,
});

interface ILogAxisBounds {
    min: number;
    max: number;
    values: number[];
}

function getLogAxisBounds(axisLength, highLow, scaleMinSpace, onlyInteger, logBase: number): ILogAxisBounds {
    let bounds = Chartist.getBounds(axisLength, highLow, scaleMinSpace, onlyInteger);

    var minDecade = Math.floor(baseLog(highLow.low, logBase));
    var maxDecade = Math.ceil(baseLog(highLow.high, logBase));

    bounds.min = Math.pow(logBase, minDecade);
    bounds.max = Math.pow(logBase, maxDecade);
    bounds.values = [];
    for (var decade = minDecade; decade <= maxDecade; ++decade) {
        bounds.values.push(Math.pow(logBase, decade));
    }
    return bounds;
}

function baseLog(val, base) {
    return Math.log(val) / Math.log(base);
}

function allValuesEqual(data, dimension): boolean {
    let value = null;

    function sameValue(data): boolean {
        if (Array.isArray(data)) {
            return data.every(sameValue);
        }
        var v = dimension ? +data[dimension] : +data;
        return value == null || v === value;
    }
    return sameValue(data);
}

function getLogAxisHighLow(
    data: {x:number, y:number}[],
    options: any, dimension: string): { low: number, high: number } {

    var highLow = options.highLow || Chartist.getHighLow(data, options, dimension);

    if (data.length === 0) {
        highLow.low = 1;
        highLow.high = 1000;
    }
    else if (highLow.low === 0 && highLow.high > 0 && allValuesEqual(data, dimension)) {
        // Chartist.getHighLow sets low to 0 if low would equal high
        highLow.low = highLow.high * 0.9;
    }
    else if (highLow.low * highLow.high <= 0) {
        throw new Error('Negative or zero values are not supported on logarithmic axes.');
    }
    return highLow;
}

function logAxisProjectValue(value) {
    value = +Chartist.getMultiValue(value, this.units.pos);
    var max = this.bounds.max;
    var min = this.bounds.min;
    if (this.scale.type === 'log') {
        var base = this.scale.base;
        return this.axisLength / baseLog(max / min, base) * baseLog(value / min, base);
    }
    return this.axisLength * (value - min) / this.bounds.range;
}
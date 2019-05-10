# chartist-logaxis

Monkey patches `Chartist.AutoScaleAxis` to support logarithmic scaling.
Example usage:

```
npm i chartist chartist-logaxis
```

```typescript
import 'chartist'
import 'chartist-logaxis'

var chart = new Chartist.Line('#mychart', 
{
    series: [[{ x: 1, y: 1 }, { x: 2, y: 100 }, { x: 3, y: 1000 }]]
},
{
    axisY: {
        type: Chartist.AutoScaleAxis,
        scale: 'log10',
    }
}); 
```

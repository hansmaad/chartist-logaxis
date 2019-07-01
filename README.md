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
    classNames: {
        gridMinor: 'ct-grid-minor'
    },
    axisY: {
        showMinorGrid: true,
        type: Chartist.AutoScaleAxis,
        scale: 'log10',
    }
});
```

```css
.ct-grid {
    stroke-dasharray: none;
}
.ct-grid-minor {
    stroke-dasharray: 2px;
}
```

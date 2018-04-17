let config = {
    minValue: 0,
    maxValue: 100,
    circleThickness: 0.05, //外部的圆框的宽度，相对于半径而言
    circleFillGap: 0.05, //外部圆框跟里面的波浪之间的空隙的宽度
    waveHeight: 0.03,
    waveCount: 4,
    waveOffset: 0,
};

let loadGauge = (element, value) => {
    let gauge = d3.select('#' + element);
    let radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    let locationX = parseInt(gauge.style("width")) / 2 - radius;
    let locationY = parseInt(gauge.style("height")) / 2 - radius;

    let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
    //根据相应的值计算waveheight的函数关系
    let waveHeightScale = d3.scaleLinear()
        .domain([0, 50, 100])
        .range([0, config.waveHeight, 0]);
    let circleThickness = config.circleThickness * radius;
    let circleFillGap = config.circleFillGap * radius;


    let gaugeCircleX = d3.scaleLinear().range([0, 2* Math.PI]).domain([0, 1]);
    let gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

    //内部的区域的实际有效半径
    let fillCircleRadius = radius - circleFillGap - circleThickness;

    let waveHeight = fillCircleRadius*waveHeightScale(0.5 * 100);
    let waveLength = fillCircleRadius*2/config.waveCount;
    
    let waveClipCount = 1 + config.waveCount;
    let waveClipWidth = waveLength * waveClipCount;

    let waveScaleX = d3.scaleLinear().domain([0, 1]).range([0, waveClipWidth]);
    let waveScaleY = d3.scaleLinear().domain([0, 1]).range([0, waveHeight]);

    let waveRiseScale = d3.scaleLinear().domain([0, 1])
        .range([(circleThickness + circleFillGap + fillCircleRadius*2+ waveHeight), (circleFillGap + circleThickness - waveHeight)]);

    let data = [];
    for (let i = 0; i <= 40*waveClipCount; i++) {
        data.push({x: i/(40*waveClipCount), y: i/40 })
    }
    console.log(data)

    let outerCircle = gauge.append("g")
        .attr("transform", "translate(" + locationX + "," + locationY + ")")

    let circleArea = d3.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius - circleThickness));

    outerCircle.append('path')
        .attr("d", circleArea)
        .style("fill", "#e3e3e3")
        .attr("transform", "translate(" + radius + "," + radius + ")")
    
    let clipArea = d3.area()
        .x((d) => {return waveScaleX(d.x)})
        .y0((d) => { var aa = waveScaleY(Math.sin(Math.PI*2*config.waveOffset*(-1) + Math.PI*2*(1- config.waveCount)+ d.y*2*Math.PI));;return aa;})
        .y1((d) => { return (fillCircleRadius*2 + waveHeight)})

    let waveGroup = outerCircle.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + element);
    let wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0)

    let waveGroupXPosition = circleThickness + circleFillGap + fillCircleRadius*2 - waveClipWidth;
    waveGroup.attr("transform", "translate(" + waveGroupXPosition + "," + waveRiseScale(0) + ")")
        .transition()
        .attr("transform", "translate(" + waveGroupXPosition + "," + waveRiseScale(0.5) + ")")
        .on("start", () => { wave.attr("transform", "translate(1,0)")})

    

    let fillCircleGroup = outerCircle.append("g")
        .attr("clip-path", "url(#clipWave" + element + ")");

    fillCircleGroup
        .append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", "steelblue")

    let waveAnimateScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, waveClipWidth - fillCircleRadius*2])
    
    let animateWave = () => {
        wave.attr("transform", "translate(" + waveAnimateScale(wave.attr("T")) + ",0)");
        wave.transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("transform", "translate(" + waveAnimateScale(1) + ",0)")
            .attr("T", 1)
            .on("end", () => {
                wave.attr("T", 0);
                animateWave()
            })
    }

    animateWave()
    
      
    console.log({radius, locationX, locationY, circleThickness});
}



let testArea = () => {
    var points = [
        {x: 0, low: 30, high: 80},
        {x: 100, low: 80, high: 100},
        {x: 200, low: 20, high: 30},
        {x: 300, low: 20, high: 50},
        {x: 400, low: 10, high: 40},
        {x: 500, low: 50, high: 80}
      ];
      var areaGenerator = d3.area()
}

loadGauge('chart2');
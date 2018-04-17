let config = {
    size: 150,
    label: "aaa",
    min: 0,
    max: 100
}

let generateGauge = (element, configure) => {
    let ele = d3.select(element);
    let defaultConfig = {
        size: 200,
        label: "aaa",
        min: 0,
        max: 100,
        majorTicks: 5,
        minorTicks: 5
    };

    //initate the default params
    this.config = defaultConfig;
    this.config.size = this.config.size*0.9;
    this.config.radius = this.config.size * 0.97 /2;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 2;
    this.config.min = 0;
    this.config.max = 100;
    this.config.majorTicks = this.config.majorTicks || 5;
    this.config.minorTicks = this.config.minorTicks || 5;
    this.config.range = this.config.max - this.config.min;

    this.config.yellowRange = [
        {from : this.config.min + this.config.range*0.75, to: this.config.min + this.config.range*0.9}
    ];
    this.config.redRange = [
        {from : this.config.min + this.config.range*0.9, to: this.config.max}
    ];

    let fontSize = Math.round(this.config.size / 16);

    //generate the area
    this.mainContent = ele.append("svg")
        .attr("class", "gauge-svg")
        .attr("width", this.config.size)
        .attr("height", this.config.size);
    
    this.mainContent.append("circle")
        .attr("cx", this.config.cx)
        .attr("cy", this.config.cy)
        .attr("r", this.config.radius)
        .style("fill", "#ccc")
        .style("stroke", "#000")
        .style("stroke-width", 0.5);

    this.mainContent.append("circle")
        .attr("cx", this.config.cx)
        .attr("cy", this.config.cy)
        .attr("r", 0.9*this.config.radius)
        .style("fill", "#fff")
        .style("stroke", "#e0e0e0")
        .style("stroke-width", "2");

    //将位置值转为度数
    let valueToRotate = (value) => {
        return (value - this.config.min) / this.config.range * 270 - 45;
    }

    let calculateDegree = (value) => {
        let initDegree = (value - this.config.min) / this.config.range * 270 - 45;
        return initDegree * Math.PI / 180;
    }

    //将角度转换为具体的坐标
    let valueToPosition = (value, factor) => {
        return {
            x: this.config.cx - this.config.radius * factor * Math.cos(calculateDegree(value)),
            y: this.config.cy - this.config.radius * factor * Math.sin(calculateDegree(value))
        }
    }

    let valueToPoint = (value, factor) => {
        let point = valueToPosition(value, factor);
        point.x -= this.config.cx;
        point.y -= this.config.cy;
        return point;
    }

    //画相关颜色的区域
    let drawBand = (start, end, color) => {
        if (start >= end) {
            return
        }
        this.mainContent.append("path")
            .attr("fill", color)
            .attr("d", d3.arc()
                .startAngle(calculateDegree(start))
                .endAngle(calculateDegree(end))
                .innerRadius(0.65 * this.config.radius)
                .outerRadius(0.85 * this.config.radius)
            )
            .attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ") rotate(270)")
    }

    //画指针
    let buildPointerPath = (value) => {
        let delta = this.config.range / 13;
        let head = valueToPoint(value, 0.85);
        let head1 = valueToPoint(value - delta, 0.12);
        let head2 = valueToPoint(value + delta, 0.12);

        let tailValue = value - (this.config.range * (1/(270/360)) / 2);
        let tail = valueToPoint(tailValue, 0.28);
        let tail1 = valueToPoint(tailValue - delta, 0.12);
        let tail2 = valueToPoint(tailValue + delta, 0.12);

        return [head, head1, tail2, tail, tail1, head2, head];
    }

    let reDraw = (value, transitionDuration) => {
        let pointerContainer = this.mainContent.select(".pointerContainer");

        let pointer = pointerContainer.selectAll("path");
        pointer.transition()
            .duration(1000)
            .attrTween("transform", () => {
                let pointerValue = value;
                if (value > this.config.max) {
                   pointerValue = this.config.max + 0.02*this.config.range;
                } else if (value < this.config.min) {
                   pointerValue = this.config.min - 0.02*this.config.range;
                }
                let targetRotation = valueToRotate(pointerValue) - 90;
                let currentRotation = this.currentRotation || targetRotation;
                this.currentRotation = targetRotation;
                return (step) => {
                    let rotation = currentRotation + (targetRotation - currentRotation) * step;
                    return "translate(" + this.config.cx + "," + this.config.cy + ") rotate(" + rotation + ")"
                }
            })
    }

    for (let i in this.config.yellowRange) {
        drawBand(this.config.yellowRange[i].from, this.config.yellowRange[i].to, "#FF9900")
    }

    for (let i in this.config.redRange) {
        drawBand(this.config.redRange[i].from, this.config.redRange[i].to, "#DC3912")
    }

    //大的刻度线
    let majorDelta = this.config.range / (this.config.majorTicks - 1);
    for (let i = this.config.min; i <= this.config.max; i += majorDelta) {
        let minorDelta = majorDelta / this.config.minorTicks;
        //大刻度线之间的小的刻度线
        for (let j = i + minorDelta; j < Math.min(majorDelta + i, this.config.max); j += minorDelta) {
            let point1 = valueToPosition(j , 0.75);
            let point2 = valueToPosition(j, 0.85);
            this.mainContent.append("line")
                .attr("x1", point1.x)
                .attr("y1", point1.y)
                .attr("x2", point2.x)
                .attr("y2", point2.y)
                .attr("stroke", "#666")
                .attr("stroke-width", 1)
            }

        let point1 = valueToPosition(i , 0.7);
        let point2 = valueToPosition(i, 0.85);
        this.mainContent.append("line")
            .attr("x1", point1.x)
            .attr("y1", point1.y)
            .attr("x2", point2.x)
            .attr("y2", point2.y)
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        if ((i === this.config.min) || (i === this.config.max)) {
            let point = valueToPosition(i, 0.63)
            this.mainContent
                .append("text")
                .attr("x", point.x)
                .attr("y", point.y)
                .attr("text-anchor", i === this.config.min ? "start" : "end")
                .text(i)
                .attr("dy", fontSize / 3)
                .attr("font-size", fontSize)
                .attr("fill", "#333")
                .attr("stroke-width", 0)
        }
    };

    let pointerContainer = this.mainContent
        .append("g").attr("class", "pointerContainer");
    let midValue = (this.config.min + this.config.max) / 2;
    let pointerPath = buildPointerPath(midValue);

    let pointerLine = d3.line()
        .x((d) => {return d.x})
        .y((d) => {return d.y})
        .curve(d3.curveBasis)

    pointerContainer.selectAll("path")
        .data([pointerPath])
        .enter()
        .append("path")
        .attr("d", pointerLine)
        .attr("fill", "#dc3912")
        .attr("stroke", "c63310")
        .attr("fill-opacity", 0.7)
        .attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ")")

    pointerContainer.append("circle")
        .attr("cx", this.config.cx)
        .attr("cy", this.config.cy)
        .attr("r", 0.12 * this.config.radius)
        .attr("fill", "#4684EE")
        .attr("stroke", "#666");
    reDraw(this.config.min, 0)
}


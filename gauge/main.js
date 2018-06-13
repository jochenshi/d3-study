class GaugeBoard {
    constructor(element, configs) {
        this.ele = d3.select(element);
        let defaultConfig = {
            size: 200,
            label: "board",
            min: 0,
            max: 100,
            majorTicks: 5,
            minorTicks: 5
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.initParams();
        this.generateMain();
        this.drawColor();
        this.drawMark();
        this.drawPointer();

    }

    //init some params
    initParams() {
        this.config.size = this.config.size * 0.9;
        this.config.radius = this.config.size * 0.97 / 2;
        this.config.cx = this.config.size / 2;
        this.config.cy = this.config.size / 2;
        this.config.range = this.config.max - this.config.min;
        this.config.yellowRange = [
            {from: this.config.min + this.config.range * 0.75, to: this.config.min + this.config.range * 0.9}
        ];
        this.config.redRange = [
            {from: this.config.min + this.config.range * 0.9, to: this.config.max}
        ];

        this.fontSize = Math.round(this.config.size / 16);
    }

    // generate the main content
    generateMain() {
        this.mainContent = this.ele.append("svg")
            .attr("class", "gauge-class")
            .attr("width", this.config.size)
            .attr("height", this.config.size);

        this.mainContent.append("circle")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", this.config.radius)
            .attr("fill", "#ccc")
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5);

        this.mainContent.append("circle")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", 0.9 * this.config.radius)
            .style("fill", "#fff")
            .style("stroke", "#e0e0e0")
            .style("stroke-width", "2");

        this.mainContent.append("text")
            .attr("x", this.config.cx)
            .attr("y", this.config.cy / 2 + this.fontSize / 2)
            .attr("dy", this.fontSize / 2)
            .attr("text-anchor", "middle")
            .text(this.config.label)
            .attr("font-size", this.fontSize)
            .attr("fill", "#333")
            .attr("stroke-width", 0)

    }

    valueToRotate(value) {
        return (value - this.config.min) / this.config.range * 270 - 45;
    }

    //pointer position calculate
    valueToPoint(value, factor) {
        let point = this.valueToPosition(value, factor);
        point.x -= this.config.cx;
        point.y -= this.config.cy;
        return point;
    }

    calculateDegree(value) {
        let initRotate = this.valueToRotate(value);
        return initRotate * Math.PI / 180;
    }

    //将角度转换为相应的坐标
    valueToPosition(value, factor) {
        return {
            x: this.config.cx - this.config.radius * factor * Math.cos(this.calculateDegree(value)),
            y: this.config.cy - this.config.radius * factor * Math.sin(this.calculateDegree(value))
        }
    }

    //绘制深色区域的公共方法
    drawBand(start, end, color) {
        if (start >= end) {
            return
        }
        this.mainContent.append("path")
            .attr("fill", color)
            .attr("d", d3.arc()
                .startAngle(this.calculateDegree(start))
                .endAngle(this.calculateDegree(end))
                .innerRadius(0.65 * this.config.radius)
                .outerRadius(0.85 * this.config.radius)
            )
            //.attr("opacity", 0.8)
            .attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ") rotate(270)")
    }

    //绘制指针区域的具体的方法
    drawPointer() {
        this.pointerContainer = this.mainContent
            .append("g").attr("class", "pointerContainer");
        let midValue = (this.config.min + this.config.max) / 2;
        let pointerPath = this.buildPointerPath(midValue);

        let pointerLine = d3.line()
            .x((d) => {
                return d.x
            })
            .y((d) => {
                return d.y
            })
            .curve(d3.curveBasis);

        this.pointerContainer.selectAll("path")
            .data([pointerPath])
            .enter()
            .append("path")
            .attr("d", pointerLine)
            .attr("fill", "#dc3912")
            .attr("stroke", "c63310")
            .attr("fill-opacity", 0.7);
        //.attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ")")

        this.pointerContainer.append("circle")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", 0.12 * this.config.radius)
            .attr("fill", "#4684EE")
            .attr("stroke", "#666");

        //生成文字显示区域的方法
        this.pointerContainer.selectAll("text")
            .data([midValue])
            .enter()
            .append("text")
            .attr("x", this.config.cx)
            .attr("y", this.config.size - this.config.cy / 4 - this.fontSize)
            .attr("dy", this.fontSize / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", this.fontSize)
            .attr("fill", "#000")
            .attr("stroke-width", 0);


        this.redraw(this.config.min, 0);
    }

    //绘制指针区域的转换值的方法
    buildPointerPath(value) {
        let delta = this.config.range / 13;
        let head = this.valueToPoint(value, 0.85);
        let head1 = this.valueToPoint(value - delta, 0.12);
        let head2 = this.valueToPoint(value + delta, 0.12);

        //将值变动半圈的大小，实现指针的尾部的部分
        let tailValue = value + (this.config.range * (1 / (270 / 360)) / 2);
        let tail = this.valueToPoint(tailValue, 0.28);
        let tail1 = this.valueToPoint(tailValue - delta, 0.12);
        let tail2 = this.valueToPoint(tailValue + delta, 0.12);

        return [head, head1, tail2, tail, tail1, head2, head];
    }

    //根据新的值转动指针的方法
    redraw(value, transitionDuration) {
        let pointerContainer = this.mainContent.select(".pointerContainer");
        pointerContainer.selectAll("text")
            .text(Math.round(value));

        let pointer = pointerContainer.selectAll("path");
        pointer.transition()
            .duration(1000)
            .attrTween("transform", () => {
                let pointerValue = value;
                if (value > this.config.max) {
                    pointerValue = this.config.max + 0.02 * this.config.range;
                } else if (value < this.config.min) {
                    pointerValue = this.config.min - 0.02 * this.config.range;
                }
                let targetRotation = this.valueToRotate(pointerValue) - 90;
                let currentRotation = this.currentRotation || targetRotation;
                this.currentRotation = targetRotation;
                return (step) => {
                    let rotation = currentRotation + (targetRotation - currentRotation) * step;
                    return "translate(" + this.config.cx + "," + this.config.cy + ") rotate(" + rotation + ")"
                }
            })
    }

    //绘制刻度线的方法
    drawMark() {
        let majorDelta = this.config.range / (this.config.majorTicks - 1);
        for (let i = this.config.min; i <= this.config.max; i += majorDelta) {
            let minorDelta = majorDelta / this.config.minorTicks;
            //大刻度线之间的小的刻度线
            for (let j = i + minorDelta; j < Math.min(majorDelta + i, this.config.max); j += minorDelta) {
                let point1 = this.valueToPosition(j, 0.75);
                let point2 = this.valueToPosition(j, 0.85);
                this.mainContent.append("line")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y)
                    .attr("stroke", "#666")
                    .attr("stroke-width", 1)
            }

            let point1 = this.valueToPosition(i, 0.7);
            let point2 = this.valueToPosition(i, 0.85);
            this.mainContent.append("line")
                .attr("x1", point1.x)
                .attr("y1", point1.y)
                .attr("x2", point2.x)
                .attr("y2", point2.y)
                .attr("stroke", "#333")
                .attr("stroke-width", 2);

            if ((i === this.config.min) || (i === this.config.max)) {
                let point = this.valueToPosition(i, 0.63)
                this.mainContent
                    .append("text")
                    .attr("x", point.x)
                    .attr("y", point.y)
                    .attr("text-anchor", i === this.config.min ? "start" : "end")
                    .text(i)
                    .attr("dy", this.fontSize / 3)
                    .attr("font-size", this.fontSize)
                    .attr("fill", "#333")
                    .attr("stroke-width", 0)
            }
        }
    }

    //具体的绘制不通颜色区域的执行的方法
    drawColor() {
        for (let i in this.config.yellowRange) {
            this.drawBand(this.config.yellowRange[i].from, this.config.yellowRange[i].to, "#FF9900")
        }

        for (let i in this.config.redRange) {
            this.drawBand(this.config.redRange[i].from, this.config.redRange[i].to, "#DC3912")
        }
    }
}
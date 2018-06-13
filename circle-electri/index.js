class ElecCircle {
    constructor(element, configs) {
        this.ele = d3.select(element);
        this.defaultConfig = {
            margin: {
                top: 40,
                right: 40,
                bottom: 40,
                left: 40
            }
        };
        this.config = Object.assign({}, this.defaultConfig, configs);
        this.initParams();
        this.setOuterCircle();
        this.setTicks();
        this.setArc();
    }

    initParams() {
        this.mainContent = this.ele.append("svg")
            .attr("height", 600)
            .attr("width", 600);
        this.width = 600 - this.config.margin.left - this.config.margin.right;
        this.height = 600 - this.config.margin.top - this.config.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2;
        this.cx = this.width / 2 + this.config.margin.left;
        this.cy = this.height / 2 + this.config.margin.top;
    }

    setOuterCircle() {
        this.circleOuter = this.mainContent.append("g");
        this.circle = this.circleOuter.append("circle")
            .attr("cx", this.cx)
            .attr("cy", this.cy)
            .attr("r", this.radius)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
    }

    setArc() {
        let test = [
            {percent: 1, arg: 360 / 122},
            {percent: 0.6, arg: 20}
        ];

        this.mainContent.append("g")
            .selectAll("path")
            .data(test)
            .enter()
            .append("path")
            .attr("d", (d) => {
                return this.drawTri(d)
            })
            //.attr("fill", "none")
            .attr("stroke-opacity", "#000")
        //.attr("transform", "translate(" + this.cx + "," + this.cy + ")");

        /*let poly = this.drawTri(test[0]);
        this.ele.append(poly)*/
    }

    drawTri(val) {
        let pat = d3.path();
        pat.moveTo(this.cx, this.cy);
        pat.lineTo((this.cx + this.radius * Math.sin(val.arg * Math.PI / 180) * val.percent), (this.cy - this.radius * Math.cos(val.arg * Math.PI / 180) * val.percent))
        pat.lineTo(this.cx, (this.cy - this.radius * Math.cos(0) * val.percent));
        pat.closePath();

        return pat
        /*return d3.polygonArea([
            [this.cx, this.cy],
            [this.cx + this.radius*Math.sin(val.arg*Math.PI/180), this.cy - this.radius*Math.cos(val.arg*Math.PI/180)],
            [this.cx, this.cy - this.radius*Math.cos(val.arg*Math.PI/180)]
        ])*/
    }

    drawSingleContent(data) {

    }

    handleData() {
        let testData = [
            {name: "A", wind: 100, solar: 20, coal: 40, combined: 60, hydro: 70},
            {name: "B", wind: 10, solar: 120, coal: 20, combined: 30, hydro: 40},
            {name: "C", wind: 20, solar: 90, coal: 70, combined: 40, hydro: 30},
            {name: "D", wind: 30, solar: 60, coal: 100, combined: 10, hydro: 20},
        ];
        let keys = [], legends = [];
        for (let i = 0; i < testData.length; i++) {
            keys.push(testData[i].name)
        }
    }

    setTicks() {
        let labelArea = this.mainContent.append("g")
            .attr("class", "tickWrapper")
            .attr("transform", "translate(" + this.cx + "," + this.cy + ")");

        d3.json('data.json', (data) => {
            console.log(data);
            let num = 24;
            let dataLen = data.length;
            for (let i = 0; i < num; i++) {
                let angle = i * (Math.PI / 180) * 360 / num;
                labelArea.append("text")
                    .text(() => {
                        return ((i < 10) ? '0' + i : i) + ':00'
                    })
                    .style("font-size", 14)
                    .attr("text-anchor", "middle")
                    //.attr("alignment-baseline", "middle")
                    .attr("x", () => {
                        return Math.sin(angle) * (this.radius + 23)
                    })
                    .attr("y", -Math.cos(angle) * (this.radius + 23))
            }

            /*labelArea.selectAll(".labelText")
                .data(data)
                .enter()
                .append("text")
                .text((d, i) => {
                    let fn = d3.timeFormat("%Y-%m-%d %H:%M:%S");
                    let times = d3.isoParse(d.ts);
                    let resTime = fn(d3.isoParse(d.ts));
                    let hour = times.getHours() < 10 ? "0" + times.getHours() : times.getHours();
                    let minute = times.getMinutes() < 10 ? "0" + times.getMinutes() : times.getMinutes();
                    return i%6 === 0 ? hour + ":" + minute : ''
                })
                .attr("text-anchor", "middle")
                .style("font-size", 14)
                .attr("alignment-baseline", "middle")
                .attr("x", (d, i) => {
                    return Math.sin((Math.PI/180)* i*360/dataLen) * (this.radius + 23)
                })
                .attr("y", (d, i) => {
                    return Math.cos((Math.PI/180)* i*360/dataLen) * (this.radius + 23)
                })*/
        })
    }

    setData() {

    }


    drawAngle(val) {
        return d3.arc()
            .startAngle(() => {
                return 0
            })
            .endAngle(() => {
                return val.arg * Math.PI / 180
            })
            .innerRadius(0)
            .outerRadius(() => {
                return this.radius * val.percent
            })
    }
}
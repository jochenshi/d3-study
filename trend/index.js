class TrendChart{
    constructor(ele, configs = {}) {
        this.container = d3.select(ele);
        let defaultConfig = {};
        this.config = Object.assign({}, defaultConfig, configs);
        this.generateContainer();
        this.setupDefault();
        /*this.generateGradient();
        this.generateTest();*/
    }

    setupDefault() {
        this.color = [
            "#66ff00",
            "#ffff00",
            "#3399cc",
            "#ff0000"
        ];
        this.data = [
            {
                from: {
                    name: "placeA",
                    position: [30, 50]
                },
                to: {
                    name: "placeB",
                    position: [500, 200]
                },
                value: 10,
                level: 1,
                width: 3
            },
            {
                from: {
                    name: "placeA",
                    position: [30, 50]
                },
                to: {
                    name: "placeC",
                    position: [200, 400]
                },
                value: 20,
                level: 2,
                width: 5
            },
            {
                from: {
                    name: "placeC",
                    position: [200, 400]
                },
                to: {
                    name: "placeA",
                    position: [30, 50]
                },
                value: 30,
                level: 3,
                width: 7
            },
            {
                from: {
                    name: "placeB",
                    position: [500, 200]
                },
                to: {
                    name: "placeA",
                    position: [30, 50]
                },
                value: 40,
                level: 4,
                width: 9
            },
            {
                from: {
                    name: "placeB",
                    position: [500, 200]
                },
                to: {
                    name: "placeC",
                    position: [200, 400]
                },
                value: 20,
                level: 2,
                width: 5
            },
            {
                from: {
                    name: "placeC",
                    position: [200, 400]
                },
                to: {
                    name: "placeB",
                    position: [500, 200]
                },
                value: 30,
                level: 3,
                width: 7
            }
        ];
        this.generateGradient();
        this.getAllPoints();
        this.generatePoints();
        this.generateLine();
    }

    generateContainer() {
        this.mainContainer = this.container.append("g")
            .attr("class", "main-container");

        this.pointArea = this.mainContainer.append("g")
            .attr("class", "point-container");

        this.lineArea = this.mainContainer.append("g")
            .attr("class", "line-container")
    }

    getAllPoints() {
        let tt = {}, res = [];
        this.data.forEach((val) => {
            tt[val.from.name] = val.from;
            tt[val.to.name] = val.to;
        });
        for (let i in tt) {
            res.push(tt[i])
        }
        console.log(tt)
        this.handleData = res;

        //处理数据的等级

    }

    generatePoints() {
        this.pointArea.selectAll(".main-point")
            .data(this.handleData)
            .enter()
            .append("circle")
            .attr("class", "main-point")
            .attr("cx", d => d.position[0])
            .attr("cy", d => d.position[1])
            .attr("fill", "white")
            .attr("r", 3)
    }

    getControlPoint(startPoint, endPoint) {
        let cx, cy;
        if (startPoint[0] < endPoint[0]) {
            if (startPoint[1] < endPoint[1]) {
                cx = (startPoint[0] + endPoint[0])/2 + 80/Math.sqrt(Math.pow((startPoint[0] - endPoint[0])/(startPoint[1] - endPoint[1]), 2) + 1);
                cy = (startPoint[1] + endPoint[1])/2 - 80/Math.sqrt(Math.pow((startPoint[1] - endPoint[1])/(startPoint[0] - endPoint[0]), 2) + 1);
            } else {
                cx = (startPoint[0] + endPoint[0])/2 - 80/Math.sqrt(Math.pow((startPoint[0] - endPoint[0])/(startPoint[1] - endPoint[1]), 2) + 1);
                cy = (startPoint[1] + endPoint[1])/2 - 80/Math.sqrt(Math.pow((startPoint[1] - endPoint[1])/(startPoint[0] - endPoint[0]), 2) + 1);
            }
        } else {
            if (startPoint[1] < endPoint[1]) {
                cx = (startPoint[0] + endPoint[0])/2 + 80/Math.sqrt(Math.pow((startPoint[0] - endPoint[0])/(startPoint[1] - endPoint[1]), 2) + 1);
                cy = (startPoint[1] + endPoint[1])/2 + 80/Math.sqrt(Math.pow((startPoint[1] - endPoint[1])/(startPoint[0] - endPoint[0]), 2) + 1);
            } else {
                cx = (startPoint[0] + endPoint[0])/2 - 80/Math.sqrt(Math.pow((startPoint[0] - endPoint[0])/(startPoint[1] - endPoint[1]), 2) + 1);
                cy = (startPoint[1] + endPoint[1])/2 + 80/Math.sqrt(Math.pow((startPoint[1] - endPoint[1])/(startPoint[0] - endPoint[0]), 2) + 1);
            }
        }
        return [cx, cy]
    }

    generateLine() {
        this.lineWrapperAll = this.lineArea.selectAll(".line-area")
            .data(this.data);

        /*this.lineArea.append("rect")
            .attr("width", 500)
            .attr("height", 500)
            .attr("fill", "url(#grad)");*/

        this.newWrapper = this.lineWrapperAll
            .enter()
            .append("g")
            .attr("class", "line-area");

        this.newWrapper.append("path")
            .attr("class", "back-path")
            .attr("id", (d, i) => "pathid_" + i)
            .attr("stroke-opacity", 0.4)
            .attr("stroke", "#e3e3e3")
            .attr("fill", "none")
            .attr("stroke-width", d => d.width)
            .attr("d", d => this.generatePath(d.from.position, d.to.position));


        /*this.newWrapper.append("defs")
            .append("mask")
            .attr("id", (d, i) => {
                return "mask1"
            })
            .append("circle")
            .attr("cx", d => d.from.position[0])
            .attr("cy", d => d.from.position)
            .attr("r", 100)
            .attr("fill", "url(#grad)");*/


        let newPath = this.newWrapper.append("path")
            //.attr("stroke", "red")
            .attr("stroke", d => {
                console.log(this.judgePosition(d.from.position, d.to.position, this.getControlPoint(d.from.position, d.to.position)))
                return this.judgePosition(d.from.position, d.to.position, this.getControlPoint(d.from.position, d.to.position)) ?
                    "url(#linear-grad-" + d.level + ")" :
                    "url(#linear-grad-reserve-" + d.level + ")"
            })
            .attr("fill", "none")
            .attr("stroke-width", d => d.width);

        this.moveLine(newPath);

        /*this.newWrapper.append("circle")
            .attr("class", "move-point")
            .attr("fill", "#e3e3e3")
            .attr("cx", d => d.from.position[0])
            .attr("cy", d => d.from.position[1])
            .attr("r", 5)
            .transition()
            .duration(4000)
            .attrTween("transform", (d, i, ele) => {
                let sibNode = ele[i].parentNode.querySelector('.back-path');
                let total = sibNode.getTotalLength();
                return (t) => {
                    let aa = sibNode.getPointAtLength(t * total);
                    return "translate(" + (aa.x - d.from.position[0]) + "," + (aa.y - d.from.position[1]) + ")"
                }
            })*/

        let cc = this.newWrapper.append("circle")
            .attr("class", "move-point")
            .attr("fill", "#e3e3e3")
            .attr("cx", d => d.from.position[0])
            .attr("cy", d => d.from.position[1])
            .attr("r", d => d.width);

        this.moveCircle(cc)


        /*this.newWrapper.append("circle")
            .attr("class", "move-point")
            .attr("r", 3)
            .append("animateMotion")
            .attr("dur", "4s")
            .attr("repeatCount", "indefinite")
            .append("mpath")
            .attr("xlink:href", (d, i) => {
                return "#pathid_" + i
            })*/
    }

    //移动圆点
    moveCircle(target) {
        target
            .transition()
            .duration(4000)
            .attrTween("transform", (d, i, ele) => {
                let sibNode = ele[i].parentNode.querySelector('.back-path');
                let total = sibNode.getTotalLength();
                return (t) => {
                    let aa = sibNode.getPointAtLength(t * total);
                    return "translate(" + (aa.x - d.from.position[0]) + "," + (aa.y - d.from.position[1]) + ")"
                }
            })
            .on("end", () => {
                this.moveCircle(target)
            })
    }

    //移动线条
    moveLine(target) {
        target
            .transition()
            .duration(4000)
            .attrTween("d", (d, i, ele) => {
                let sibNode = ele[i].parentNode.querySelector('.back-path');
                let total = sibNode.getTotalLength();
                let test = d3.select(sibNode).attr('d').replace(/(M|Q)/g, '@').match(/((\d|\.)+)/g);
                return (t) => {
                    let aa = sibNode.getPointAtLength(t * total);
                    let x = (1-t) * (+test[0]) + t * (+test[2]);
                    let y = (1-t) * (+test[1]) + t * (+test[3]);
                    return "M" + +test[0] + "," + +test[1] + " Q" + x + "," + y + " " + aa.x + "," + aa.y
                }
            })
            .on("end", () => {
                this.moveLine(target)
            });
    }

    generatePath(start, end) {
        let path = d3.path();
        let control = this.getControlPoint(start, end);
        path.moveTo(start[0], start[1]);
        path.quadraticCurveTo(control[0], control[1], end[0], end[1]);
        return path;
    }


    //true在下方, false在上方
    judgePosition(start, end, judge) {
        if (start[0] > end[0]) {
            return (start[1] - end[1])*(judge[0] - start[0]) > (start[0] - end[0])*(judge[1] - start[1])
        } else if (start[0] < end[0]) {
            return (start[1] - end[1])*(judge[0] - start[0]) < (start[0] - end[0])*(judge[1] - start[1])
        } else {
            return end[1] > start[1]
        }
    }

    generateTest() {
        let testData = [
            {x: 20, y: 60},
            {x: 200, y: 300}
        ];
        let path = d3.path();

        let lineContainer = this.container.append("g")
            .attr("class", "line-container");

        let cx = (testData[0].x + testData[1].x)/2 + 80/Math.sqrt(Math.pow((testData[1].x - testData[0].x)/(testData[1].y - testData[0].y), 2) + 1);
        let cy = (testData[0].y + testData[1].y)/2 - 80/Math.sqrt(Math.pow((testData[1].y - testData[0].y)/(testData[1].x - testData[0].x), 2) + 1);

        console.log(cx, cy);

        path.moveTo(testData[0].x, testData[0].y);
        path.quadraticCurveTo(cx, cy, testData[1].x, testData[1].y);

        window.testPath = path;

        this.testLine = lineContainer.append("path")
            .attr("opacity", 0.7)
            .attr("stroke", "#e3e3e3")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("d", path);

        this.line = lineContainer.append("path")
            .attr("stroke", "url(#grad)")
            .attr("fill", "none")
            .attr("stroke-width", 4);


        setInterval(() => {
            this.line
                .attr("opacity", 1)
                .transition()
                .duration(4000)
                .attrTween("d", () => {
                    let total = this.testLine.node().getTotalLength();
                    let test = this.testLine.attr('d').replace(/(M|Q)/g, '@').match(/((\d|\.)+)/g);
                    return (t) => {
                        let aa = this.testLine.node().getPointAtLength(t * total);
                        let x = (1-t) * (+test[0]) + t * (+test[2]);
                        let y = (1-t) * (+test[1]) + t * (+test[3]);
                        return "M" + +test[0] + "," + +test[1] + " Q" + x + "," + y + " " + aa.x + "," + aa.y
                    }
                });

            this.line.transition()
                .delay(4000)
                .duration(1000)
                .attr("opacity", 0);
        }, 5000);

        this.line
            .attr("opacity", 1)
            .transition()
            .duration(4000)
            .attrTween("d", () => {
                let total = this.testLine.node().getTotalLength();
                let test = this.testLine.attr('d').replace(/(M|Q)/g, '@').match(/((\d|\.)+)/g);
                return (t) => {
                    let aa = this.testLine.node().getPointAtLength(t * total);
                    let x = (1-t) * (+test[0]) + t * (+test[2]);
                    let y = (1-t) * (+test[1]) + t * (+test[3]);
                    return "M" + +test[0] + "," + +test[1] + " Q" + x + "," + y + " " + aa.x + "," + aa.y
                }
            });

        this.line.transition()
            .delay(4000)
            .duration(1000)
            .attr("opacity", 0);
    }

    generateGradient() {
        this.gradient = this.container.append("g")
            .attr("class", "gradient-area")
            .append("defs");

        for (let i = 0; i < this.color.length; i++) {
            this.gradient.append("linearGradient")
                .attr("id", "linear-grad-" + (i+1))
                .selectAll("stop")
                .data([0, 0.7,  1])
                .enter()
                .append("stop")
                .attr("offset", d => {
                    return d === 0 ?
                        "0%" :
                        d === 1 ? "100%" : "70%"
                })
                .attr("stop-color", this.color[i])
                .attr("stop-opacity", d => {
                    return d === 0 ? 0 :
                        d === 1 ? 1 : 0.2
                });

            this.gradient.append("linearGradient")
                .attr("id", "linear-grad-reserve-"  + (i+1))
                .selectAll("stop")
                .data([0, 0.7,  1])
                .enter()
                .append("stop")
                .attr("offset", d => {
                    return d === 0 ?
                        "0%" :
                        d === 1 ? "100%" : "30%"
                })
                .attr("stop-color", this.color[i])
                .attr("stop-opacity", d => {
                    return d === 0 ? 1 :
                        d === 1 ? 0 : 0.2
                });
        }


        /*this.gradient.append("radialGradient")
            .attr("id", "grad")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%")
            .selectAll("stop")
            .data([0, 0.7, 1])
            .enter()
            .append("stop")
            .attr("offset", d => {
                if (d === 0) {
                    return "0%"
                } else if (d === 0.7) {
                    return "10%"
                } else {
                    return "100%"
                }
            })
            .attr("stop-color", "red")
            .attr("stop-opacity", d => {
                if (d === 0) {
                    return 1
                } else if (d === 0.7) {
                    return 0.6
                } else {
                    return 0.05
                }
                //return d === 0 ? 1 : 0.3
            });

        this.gradient.append("radialGradient")
            .attr("id", "grad-reserve")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 1)
            .selectAll("stop")
            .data([0, 0.7, 1])
            .enter()
            .append("stop")
            .attr("offset", d => {
                if (d === 0) {
                    return "0%"
                } else if (d === 0.7) {
                    return "10%"
                } else {
                    return "100%"
                }
            })
            .attr("stop-color", "red")
            .attr("stop-opacity", d => {
                if (d === 0) {
                    return 1
                } else if (d === 0.7) {
                    return 0.6
                } else {
                    return 0.05
                }
                //return d === 0 ? 1 : 0.3
            });*/

    }
}
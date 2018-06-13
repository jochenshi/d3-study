class TrendChart{
    constructor(ele, configs = {}) {
        this.container = d3.select(ele);
        let defaultConfig = {};
        this.config = Object.assign({}, defaultConfig, configs);
        this.generateContainer();
        this.generateGradient();
        this.setupDefault();
        /*this.generateGradient();
        this.generateTest();*/
    }

    setupDefault() {
        this.data = [
            {
                from: {
                    name: "placeA",
                    position: [30, 50]
                },
                to: {
                    name: "placeB",
                    position: [500, 200]
                }
            },
            {
                from: {
                    name: "placeA",
                    position: [30, 50]
                },
                to: {
                    name: "placeC",
                    position: [200, 400]
                }
            },
            {
                from: {
                    name: "placeC",
                    position: [200, 400]
                },
                to: {
                    name: "placeA",
                    position: [30, 50]
                }
            },
            {
                from: {
                    name: "placeB",
                    position: [500, 200]
                },
                to: {
                    name: "placeA",
                    position: [30, 50]
                }
            },
            {
                from: {
                    name: "placeB",
                    position: [500, 200]
                },
                to: {
                    name: "placeC",
                    position: [200, 400]
                }
            },
            {
                from: {
                    name: "placeC",
                    position: [200, 400]
                },
                to: {
                    name: "placeB",
                    position: [500, 200]
                }
            }
        ];
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
        this.handleData = res;
        console.log(res);
    }

    generatePoints() {
        this.pointArea.selectAll(".main-point")
            .data(this.handleData)
            .enter()
            .append("circle")
            .attr("class", "main-point")
            .attr("cx", d => d.position[0])
            .attr("cy", d => d.position[1])
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

        this.newWrapper = this.lineWrapperAll
            .enter()
            .append("g")
            .attr("class", "line-area");

        this.newWrapper.append("path")
            .attr("class", "back-path")
            .attr("opacity", 0.5)
            .attr("stroke", "#e3e3e3")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("d", d => this.generatePath(d.from.position, d.to.position));

        let newPath = this.newWrapper.append("path")
            .attr("stroke", d => {
                console.log(this.judgePosition(d.from.position, d.to.position, this.getControlPoint(d.from.position, d.to.position)))
                return this.judgePosition(d.from.position, d.to.position, this.getControlPoint(d.from.position, d.to.position)) ?
                    "url(#grad-reserve)" :
                    "url(#grad)"
            })
            .attr("fill", "none")
            .attr("stroke-width", 4);

        newPath.transition()
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
            });

    }

    generatePath(start, end) {
        let path = d3.path();
        let control = this.getControlPoint(start, end);
        path.moveTo(start[0], start[1]);
        path.quadraticCurveTo(control[0], control[1], end[0], end[1]);
        return path;
    }

    judgePosition(point1, point2, judge) {
        console.log((judge[1] - point1[1])/(judge[0] - [point1[0]]));
        console.log((point1[1] - point2[1])/(point1[0] - point2[0]));
        return ((judge[1] - point1[1])/(judge[0] - [point1[0]]) < (point1[1] - point2[1])/(point1[0] - point2[0]))
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
            .attr("class", "gradient-area");

        this.gradient.append("radialGradient")
            .attr("id", "grad")
            .attr("cx", 1)
            .attr("cy", 1)
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
                    return "100%"
                } else if (d === 0.7) {
                    return "10%"
                } else {
                    return "0"
                }
            })
            .attr("stop-color", "red")
            .attr("stop-opacity", d => {
                if (d === 0) {
                    return 0.05
                } else if (d === 0.7) {
                    return 0.6
                } else {
                    return 1
                }
                //return d === 0 ? 1 : 0.3
            });

    }
}
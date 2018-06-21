class CubePie{
    constructor(element, configs) {
        let defaultConfig = {
            width: 500,
            height: 400,
            margin: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 30
            }
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.container = d3.select(element).append("svg")
            .style("width", this.config.width)
            .style("height", this.config.height);
    }
}
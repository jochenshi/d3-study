class LineChart{
    constructor(ele, configs) {
        let defaultConfig = {
            width: 500,
            height: 400
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.wrapper = d3.select(ele)
        .append("svg")
        .style("width", this.config.width)
        .atyle("height", this.config.height);
    }

    initData() {
        let testData = [
            {
                x: 'A',
                y: '10',
            },
            {
                x: 'B',
                y: '15',
            },
            {
                x: 'C',
                y: '25',
            },
            {
                x: 'D',
                y: '5',
            },
            {
                x: 'E',
                y: '20',
            },
            {
                x: 'F',
                y: '30',
            },
            {
                x: 'G',
                y: '6',
            }
        ];

    }
}
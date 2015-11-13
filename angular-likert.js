'use strict';

(function(){

    angular.module('likert', []);
    var number = 4;

    var likertCtrl = function(){

        var that = this;

        that.number = number;

        that.updateNumber = function(){
            if (typeof that.number != 'number' || that.number == number){
                return false;
            }
            that.chartData.data = [];
            that.chartData.labels = [];
            that.newRow.responses = [];
            number = parseInt(that.number);
            for (var i=0; i<number; i++){
                that.newRow.responses.push({response:null});
                that.chartData.labels.push({label:null});
            }
        };

        that.chartData = {
            data: [],
            labels: [{label:null},{label:null},{label:null},{label:null}],
            chartType: 'bubbles'
        };

        that.newRow = {
            question: null,
            responses: [{response:null},{response:null},{response:null},{response:null}]
        };

        that.addRow = function(){
            if (that.likertForm.$invalid){
                return false;
            }
            that.chartData.data.push($.extend(true, {}, that.newRow));
            that.newRow = {
                question: null,
                responses: []
            };
            for (var i=0; i<number; i++){
                that.newRow.responses.push({response:null});
            }
        };

        that.removeRow = function(index){
            that.chartData.data.splice(index, 1);
        };

    };

    var likertChart = function(){

        var colours = {
            1: ['#CD7B00'],
            2: ["#fc8d59","#91bfdb"],
            3: ["#fc8d59","#ffffbf","#91bfdb"],
            4: ["#d7191c","#fdae61","#abd9e9","#2c7bb6"],
            5: ["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],
            6: ["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],
            7: ["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],
            8: ["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],
            9: ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],
            10: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
            11: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
        };

        return {
            restrict: 'AE',
            replace: true,
            scope: {
                chartData: '=chartData'
            },
            link: function($scope, $element){

                var lineFun = d3.svg.line()
                    .x(function(d){return d.x})
                    .y(function(d){return d.y})
                    .interpolate('linear');

                $scope.$watch('chartData', function(newData){
                    $element.html("");
                    var width = 1140;

                    var hasLabels = false;
                    for (var i=0; i<newData.labels.length; i++){
                        if(newData.labels[i].label != null){
                            hasLabels = true;
                            break;
                        }
                    }

                    var height = 
                        (hasLabels ? 100 : 80 )
                         + (newData.chartType == 'bubbles' ? 100 : 70) * newData.data.length + 30;

                    var svg = d3.select($element[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('id', 'chartSVG');

                    svg.append('rect')
                        .attr('fill', '#fff')
                        .attr('height', height)
                        .attr('stroke', '#ccc')
                        .attr('stroke-width', 1)
                        .attr('width', width);

                    var topLinePoints = [
                        {y:hasLabels ? 100 : 80, x: 465},
                        {y:hasLabels ? 100 : 80, x: 1065},
                    ];

                    var bottomLinePoints = [
                        {y:height-30, x: 465},
                        {y:height-30, x: 1065},
                    ];

                    svg.append('path')
                        .attr('d', lineFun(topLinePoints))
                        .attr('stroke', '#999')
                        .attr('stroke-width', 1);

                    svg.append('path')
                        .attr('d', lineFun(bottomLinePoints))
                        .attr('stroke', '#999')
                        .attr('stroke-width', 1);

                    for (var t=0; t<number; t++){

                        var topLineTickPoints = [
                            {y:(hasLabels ? 100 : 80), x: 465+t*600/(number-1)},
                            {y:(hasLabels ? 100 : 80)-10, x: 465+t*600/(number-1)},
                        ];

                        svg.append('path')
                            .attr('d', lineFun(topLineTickPoints))
                            .attr('stroke', '#999')
                            .attr('stroke-width', 1);
                        
                        svg.append('text')
                            .attr("x", 465+t*600/(number-1))
                            .attr("y", 30)
                            .text(String(t+1))
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "16px");

                        if (newData.labels[t].label != null){

                            svg.append('text')
                                .attr("x", 465+t*600/(number-1))
                                .attr("y", 54)
                                .text(newData.labels[t].label)
                                .attr("fill", '#414141')
                                .attr("text-anchor", "middle")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                        }

                        var bottomLineTickPoints = [
                            {y:height-30, x: 465+t*600/(number-1)},
                            {y:height-20, x: 465+t*600/(number-1)},
                        ];

                        svg.append('path')
                            .attr('d', lineFun(bottomLineTickPoints))
                            .attr('stroke', '#999')
                            .attr('stroke-width', 1);
                        
                    }

                    if (newData.chartType == 'stackedBar'){

                        var maxDistance = 0;
                        var leftEnd = number % 2 != 0 ? (number-1)/2 : number/2;
                        var rightStart = number % 2 != 0 ? leftEnd + 2 : leftEnd + 1;
                        var centre = number %2 != 0 ? leftEnd + 1 : null;

                        for (var d=0; d<newData.data.length; d++){
                            var leftAmount = 0;
                            var rightAmount = 0;
                            var totalAmount = 0;
                            for (var i=0; i<number; i++){
                                totalAmount += newData.data[d].responses[i].response;
                                if(i+1<=leftEnd){
                                    leftAmount += newData.data[d].responses[i].response;
                                }
                                else if (i+1>= rightStart){
                                    rightAmount += newData.data[d].responses[i].response;
                                }
                                else{
                                    rightAmount += newData.data[d].responses[i].response / 2
                                    leftAmount += newData.data[d].responses[i].response / 2
                                }
                            }

                            var biggerAmount = Math.max(leftAmount,rightAmount);

                            if (biggerAmount * 100 / totalAmount > maxDistance){
                                maxDistance = biggerAmount * 100 / totalAmount;
                            }
                        }

                    }

                    for (var d=0; d<newData.data.length; d++){

                        var rowStart = (hasLabels ? 100 : 80 ) + d * (newData.chartType == 'bubbles' ? 100 : 70);

                        if (d>0 && newData.chartType == 'bubbles'){

                            var rowLineTickPoints = [
                                {y:rowStart, x: 465},
                                {y:rowStart, x: 1065},
                            ];

                            svg.append('path')
                                .attr('d', lineFun(rowLineTickPoints))
                                .attr('stroke', '#ccc')
                                .attr('stroke-width', 1);

                        }

                        if (newData.data[d].question.length < 58){

                            svg.append('text')
                                .attr("x", 20)
                                .attr("y", rowStart + (newData.chartType == 'bubbles' ? 56 : 41))
                                .text(newData.data[d].question)
                                .attr("fill", '#414141')
                                .attr("text-anchor", "start")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                        }

                        else {

                            var noOfRows = Math.floor( newData.data[d].question.length / 58 );

                            var breakPoints = [];
                            var textRows = [];

                            for (var r=0; r<=noOfRows; r++){

                                for (var b = (r>0 ? breakPoints[r-1] : 0) + 59; b>=0; b--){
                                    if (newData.data[d].question.substr(b,1) == ' ' || b == newData.data[d].question.length){
                                        breakPoints.push(b);
                                        break;
                                    }
                                }

                                var textStart = r>0 ? breakPoints[r-1] : 0;
                                var textLength = breakPoints[r] - textStart;

                                svg.append('text')
                                    .attr("x", 20)
                                    .attr("y", rowStart + (newData.chartType == 'bubbles' ? 56 : 41) - 14 * noOfRows / 2 + r * 14)
                                    .text(newData.data[d].question.substr(textStart, textLength))
                                    .attr("fill", '#414141')
                                    .attr("text-anchor", "start")
                                    .style("font-family", "Arial")
                                    .style("font-size", "16px");

                            }

                        }

                        var totalParticipants = 0;
                        for (var i=0; i<number; i++){
                            totalParticipants += newData.data[d].responses[i].response;
                        }

                        var calculateSize = function(percentage){
                            var size = 2 * Math.sqrt( 900 * percentage )
                            return size >= 6 ? size : 6;
                        };

                        if (newData.chartType == 'bubbles'){

                            for (var i=0; i<number; i++){

                                var circleSize = calculateSize(newData.data[d].responses[i].response/totalParticipants);

                                svg.append('circle')
                                    .attr('stroke', '#504432')
                                    .attr('fill', '#CD7B00')
                                    .attr('fill-opacity', (circleSize-10)/50)
                                    .attr('r', circleSize/2)
                                    .attr('cx', 465+i*600/(number-1))
                                    .attr('cy', rowStart + 40);

                                svg.append('text')
                                    .attr("x", 465+i*600/(number-1))
                                    .attr("y", rowStart + 90)
                                    .text((newData.data[d].responses[i].response*100/totalParticipants).toFixed(0)+'%')
                                    .attr("fill", '#414141')
                                    .attr("text-anchor", "middle")
                                    .style("font-family", "Arial")
                                    .style("font-size", "14px");

                            }

                        }
                        else{
                            var fullWidth = maxDistance * 2;
                            var rightStartPoint = 765;
                            var leftEndPoint = 765;

                            if (centre != null){
                                var barWidth = 600 * (newData.data[d].responses[centre-1].response * 100 / totalParticipants) / fullWidth;

                                svg.append('rect')
                                    .attr('x', 765 - barWidth/2)
                                    .attr('y', rowStart + 5)
                                    .attr('fill', colours[String(number)][centre-1])
                                    .attr('height', 60)
                                    .attr('stroke', '#414141')
                                    .attr('stroke-width', 1)
                                    .attr('width', barWidth);

                                svg.append('text')
                                    .attr("x", 765)
                                    .attr("y", rowStart + 41)
                                    .text((newData.data[d].responses[centre-1].response*100/totalParticipants).toFixed(0)+'%')
                                    .attr("fill", '#414141')
                                    .attr("text-anchor", "middle")
                                    .style("font-family", "Arial")
                                    .style("font-size", "14px");

                                var rightStartPoint = 765 + barWidth / 2;
                                var leftEndPoint = 765 - barWidth / 2;
                            }
                            for (var j=rightStart-1; j<number; j++){
                                
                                var barWidth = 600 * (newData.data[d].responses[j].response * 100 / totalParticipants) / fullWidth;

                                svg.append('rect')
                                    .attr('x', rightStartPoint)
                                    .attr('y', rowStart + 5)
                                    .attr('fill', colours[String(number)][j])
                                    .attr('height', 60)
                                    .attr('stroke', '#414141')
                                    .attr('stroke-width', 1)
                                    .attr('width', barWidth);

                                svg.append('text')
                                    .attr("x", rightStartPoint + barWidth / 2)
                                    .attr("y", rowStart + 41)
                                    .text((newData.data[d].responses[j].response*100/totalParticipants).toFixed(0)+'%')
                                    .attr("fill", '#414141')
                                    .attr("text-anchor", "middle")
                                    .style("font-family", "Arial")
                                    .style("font-size", "14px");

                                rightStartPoint += barWidth;
                            }
                            for (var j=leftEnd-1; j>=0; j--){
                                
                                var barWidth = 600 * (newData.data[d].responses[j].response * 100 / totalParticipants) / fullWidth;

                                svg.append('rect')
                                    .attr('x', leftEndPoint-barWidth)
                                    .attr('y', rowStart + 5)
                                    .attr('fill', colours[String(number)][j])
                                    .attr('height', 60)
                                    .attr('stroke', '#414141')
                                    .attr('stroke-width', 1)
                                    .attr('width', barWidth);

                                svg.append('text')
                                    .attr("x", leftEndPoint - barWidth / 2)
                                    .attr("y", rowStart + 41)
                                    .text((newData.data[d].responses[j].response*100/totalParticipants).toFixed(0)+'%')
                                    .attr("fill", '#414141')
                                    .attr("text-anchor", "middle")
                                    .style("font-family", "Arial")
                                    .style("font-size", "14px");

                                leftEndPoint -= barWidth;
                            }
                        }
                        
                    }

                    //Convert to PNG
                    var chartHtml = d3.select('#chartSVG')
                        .attr("version", 1.1)
                        .attr("xmlns", "http://www.w3.org/2000/svg")
                        .node().parentNode.innerHTML;

                    var imgSrc = 'data:image/svg+xml;base64,'+ btoa(chartHtml);

                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext("2d");
                    canvas.height = height;
                    canvas.width = width;

                    var newImg = new Image;
                    newImg.src = imgSrc;
                    newImg.onload = function(){

                        context.drawImage(newImg, 0, 0, width, height);

                        var canvasData = canvas.toDataURL("image/png");
                        $('#downloadButton').attr('href', canvasData);
                        $('#png').attr('src', canvasData);
                        var now = new Date();
                        var nowText = 
                            ('0' + now.getDate()).slice(-2) + '-' +
                            ('0' + (now.getMonth()+1)).slice(-2) + '-' +
                            now.getFullYear() + ' ' +
                            ('0' + now.getHours()).slice(-2) + '-' +
                            ('0' + now.getMinutes()).slice(-2) + '-' +
                            ('0' + now.getSeconds()).slice(-2)
                        $('#downloadButton').attr('download', 'Likert Chart '+nowText);

                    };

                }, true);
            }
        };
    };

    angular
        .module('likert')
        .controller('likertCtrl', likertCtrl)
        .directive('likertChart', likertChart);

})();

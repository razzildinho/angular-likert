'use strict';

(function(){

    angular.module('likert', []);

    var likertCtrl = function(){

        var $scope = this;

        $scope.chartData = {
            data: [],
            oneLabel: null,
            fiveLabel: null
        };

        $scope.newRow = {
            question: null,
            one: null,
            two: null,
            three: null,
            four: null,
            five: null
        };

        $scope.addRow = function(){
            if ($scope.likertForm.$invalid){
                return false;
            }
            $scope.chartData.data.push($.extend(true, {}, $scope.newRow));
            $scope.newRow = {
                question: null,
                one: null,
                two: null,
                three: null,
                four: null,
            };
        };

        $scope.removeRow = function(index){
            $scope.chartData.data.splice(index, 1);
        };

    };

    var likertChart = function(){
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

                    var hasOneLabel = newData.oneLabel != null && newData.oneLabel.length > 0;
                    var hasFiveLabel = newData.fiveLabel != null && newData.fiveLabel.length > 0;

                    var height = 
                        ((hasOneLabel || hasFiveLabel) ? 100 : 80 )
                         + 100 * newData.data.length + 30;

                    var svg = d3.select($element[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    svg.append('rect')
                        .attr('fill', '#fff')
                        .attr('height', height)
                        .attr('stroke', '#ccc')
                        .attr('stroke-width', 1)
                        .attr('width', width);

                    var topLinePoints = [
                        {y:(hasOneLabel || hasFiveLabel) ? 100 : 80, x: 465},
                        {y:(hasOneLabel || hasFiveLabel) ? 100 : 80, x: 1065},
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

                    for (var t=0; t<5; t++){

                        var topLineTickPoints = [
                            {y:((hasOneLabel || hasFiveLabel) ? 100 : 80), x: 465+t*150},
                            {y:((hasOneLabel || hasFiveLabel) ? 100 : 80)-10, x: 465+t*150},
                        ];

                        svg.append('path')
                            .attr('d', lineFun(topLineTickPoints))
                            .attr('stroke', '#999')
                            .attr('stroke-width', 1);
                        
                        svg.append('text')
                            .attr("x", 465+t*150)
                            .attr("y", 30)
                            .text(String(t))
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "16px");

                        if (t==0 && hasOneLabel){

                            svg.append('text')
                                .attr("x", 465+t*150)
                                .attr("y", 54)
                                .text(newData.oneLabel)
                                .attr("fill", '#414141')
                                .attr("text-anchor", "middle")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                        }

                        if (t==4 && hasFiveLabel){

                            svg.append('text')
                                .attr("x", 465+t*150)
                                .attr("y", 54)
                                .text(newData.fiveLabel)
                                .attr("fill", '#414141')
                                .attr("text-anchor", "middle")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                        }

                        var bottomLineTickPoints = [
                            {y:height-30, x: 465+t*150},
                            {y:height-20, x: 465+t*150},
                        ];

                        svg.append('path')
                            .attr('d', lineFun(bottomLineTickPoints))
                            .attr('stroke', '#999')
                            .attr('stroke-width', 1);
                        
                    }

                    for (var d=0; d<newData.data.length; d++){

                        var rowStart = ((hasOneLabel || hasFiveLabel) ? 100 : 80 ) + d * 100;

                        if (d>0){

                            var rowLineTickPoints = [
                                {y:rowStart, x: 465},
                                {y:rowStart, x: 1065},
                            ];

                            svg.append('path')
                                .attr('d', lineFun(rowLineTickPoints))
                                .attr('stroke', '#ccc')
                                .attr('stroke-width', 1);

                        }

                        if (newData.data[d].question.length < 45){

                            svg.append('text')
                                .attr("x", 20)
                                .attr("y", rowStart + 56)
                                .text(newData.data[d].question)
                                .attr("fill", '#414141')
                                .attr("text-anchor", "start")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                        }

                        else{

                            var breakPoint = null;

                            for (var b=45; b>=0; b--){
                                if (newData.data[d].question.substr(b,1) == ' '){
                                    breakPoint = b;
                                    break;
                                }
                            }

                            svg.append('text')
                                .attr("x", 20)
                                .attr("y", rowStart + 49)
                                .text(newData.data[d].question.substr(0,breakPoint))
                                .attr("fill", '#414141')
                                .attr("text-anchor", "start")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                            svg.append('text')
                                .attr("x", 20)
                                .attr("y", rowStart + 63)
                                .text(newData.data[d].question.substr(breakPoint+1))
                                .attr("fill", '#414141')
                                .attr("text-anchor", "start")
                                .style("font-family", "Arial")
                                .style("font-size", "16px");

                        }

                        var totalParticipants = 
                            newData.data[d].one +
                            newData.data[d].two +
                            newData.data[d].three +
                            newData.data[d].four +
                            newData.data[d].five;

                        var oneCircleSize = newData.data[d].one/totalParticipants != 0 ? (60 - 40 * ( 1 - (newData.data[d].one/totalParticipants) )) : 10;
                        var twoCircleSize = newData.data[d].two/totalParticipants != 0 ? (60 - 40 * ( 1 - (newData.data[d].two/totalParticipants) )) : 10;
                        var threeCircleSize = newData.data[d].three/totalParticipants != 0 ? (60 - 40 * ( 1 - (newData.data[d].three/totalParticipants) )) : 10;
                        var fourCircleSize = newData.data[d].four/totalParticipants != 0 ? (60 - 40 * ( 1 - (newData.data[d].four/totalParticipants) )) : 10;
                        var fiveCircleSize = newData.data[d].five/totalParticipants != 0 ? (60 - 40 * ( 1 - (newData.data[d].five/totalParticipants) )) : 10;
                        
                        svg.append('circle')
                            .attr('stroke', '#504432')
                            .attr('stroke-opacity', 0.5)
                            .attr('fill', '#CD7B00')
                            .attr('fill-opacity', (oneCircleSize-10)/50)
                            .attr('r', oneCircleSize/2)
                            .attr('cx', 465)
                            .attr('cy', rowStart + 40);

                        svg.append('text')
                            .attr("x", 465)
                            .attr("y", rowStart + 95)
                            .text((newData.data[d].one*100/totalParticipants).toFixed(0)+'%')
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "14px");

                        svg.append('circle')
                            .attr('stroke', '#504432')
                            .attr('stroke-opacity', 0.5)
                            .attr('fill', '#CD7B00')
                            .attr('fill-opacity', (twoCircleSize-10)/50)
                            .attr('r', twoCircleSize/2)
                            .attr('cx', 615)
                            .attr('cy', rowStart + 40);

                        svg.append('text')
                            .attr("x", 615)
                            .attr("y", rowStart + 95)
                            .text((newData.data[d].two*100/totalParticipants).toFixed(0)+'%')
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "14px");

                        svg.append('circle')
                            .attr('stroke', '#504432')
                            .attr('stroke-opacity', 0.5)
                            .attr('fill', '#CD7B00')
                            .attr('fill-opacity', (threeCircleSize-10)/50)
                            .attr('r', threeCircleSize/2)
                            .attr('cx', 765)
                            .attr('cy', rowStart + 40);

                        svg.append('text')
                            .attr("x", 765)
                            .attr("y", rowStart + 95)
                            .text((newData.data[d].three*100/totalParticipants).toFixed(0)+'%')
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "14px");

                        svg.append('circle')
                            .attr('stroke', '#504432')
                            .attr('stroke-opacity', 0.5)
                            .attr('fill', '#CD7B00')
                            .attr('fill-opacity', (fourCircleSize-10)/50)
                            .attr('r', fourCircleSize/2)
                            .attr('cx', 915)
                            .attr('cy', rowStart + 40);

                        svg.append('text')
                            .attr("x", 915)
                            .attr("y", rowStart + 95)
                            .text((newData.data[d].four*100/totalParticipants).toFixed(0)+'%')
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "14px");

                        svg.append('circle')
                            .attr('stroke', '#504432')
                            .attr('stroke-opacity', 0.5)
                            .attr('fill', '#CD7B00')
                            .attr('fill-opacity', (fiveCircleSize-10)/50)
                            .attr('r', fiveCircleSize/2)
                            .attr('cx', 1065)
                            .attr('cy', rowStart + 40);

                        svg.append('text')
                            .attr("x", 1065)
                            .attr("y", rowStart + 95)
                            .text((newData.data[d].five*100/totalParticipants).toFixed(0)+'%')
                            .attr("fill", '#414141')
                            .attr("text-anchor", "middle")
                            .style("font-family", "Arial")
                            .style("font-size", "14px");

                    }

                }, true);
            }
        };
    };

    angular
        .module('likert')
        .controller('likertCtrl', likertCtrl)
        .directive('likertChart', likertChart);

})();

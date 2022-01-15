window.createTotalTable = function(data){
    const table = {
        title: "Total",
        rows: [
            {
                isHeader: true,
                cols: [
                    {
                        text: "RS Count"
                    },
                    {
                        text: "Expected RS Slice Count"
                    },
                    {
                        text: "Actual RS Slice Count"
                    },
                    {
                        text: "Fragment Count"
                    },
                ]
            },
            {
                isHeader: false,
                cols: [
                    {
                        text: data.totalSiteCount
                    },
                    {
                        text: data.totalSiteCount
                    },
                    {
                        text: data.expectedSiteCount
                    },
                    {
                        text: data.actualSiteCount
                    },
                ]
            }
        ]
    };

    if(data.restrictionEnzymes[1]){
        table.rows[0].cols.splice(1, 0, {
            text: "Conflict Sites"
        });

        table.rows[1].cols.splice(1, 0, {
            text: data.conflicts
        });
    }

    return table;
}


window.createGraphRangeTable = function(data){
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');

    return {
        title: "Graph Range",
        rows: [
            {
                isHeader: true,
                cols: [
                    {
                        text: "Fragment Count"
                    },
                    {
                        text: "Fragment Percentage"
                    },
                ]
            },
            {
                isHeader: false,
                cols: [
                    {
                        text: data.fragmentGraphRangeCount
                    },
                    {
                        text: `${(((data.fragmentGraphRangeCount)/data.fragmentCount)*100).toString().match(re)[0]}%`
                    },
                ]
            }
        ]
    };
}


window.createFocusRangeTable = function(data){
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');

    return {
        title: "Focus Range",
        rows: [
            {
                isHeader: true,
                cols: [
                    {
                        text: "Fragment Count"
                    },
                    {
                        text: "Fragment Percentage"
                    },
                ]
            },
            {
                isHeader: false,
                cols: [
                    {
                        text: data.fragmentFocusRangeCount
                    },
                    {
                        text: `${(((data.fragmentFocusRangeCount)/data.fragmentCount)*100).toString().match(re)[0]}%`
                    },
                ]
            }
        ]
    };

}


window.createInputPropertiesTable = function(data){
    const table = {
        title: "Input Properties",
        rows: [
            {
                isHeader: true,
                cols: [
                    {
                        text: data.restrictionEnzymes[1] ? "Restriction Site #1" : "Restriction Site"
                    },
                    {
                        text: "Slice Probability"
                    },
                    {
                        text: "Graph Range"
                    },
                    {
                        text: "Focus Range"
                    },
                    {
                        text: "Length Distribution"
                    },
                    {
                        text: "Include Outliers"
                    },
                ]
            },
            {
                isHeader: false,
                cols: [
                    {
                        text: restrictionEnzymes[0].site
                    },
                    {
                        text: `${data.sliceProbability*100}%`
                    },
                    {
                        text: data.graphRangeMin.toString() + "-" + data.graphRangeMax.toString()
                    },
                    {
                        text: data.focusRangeMin.toString() + "-" + data.focusRangeMax.toString()
                    },
                    {
                        text: data.lengthDistribution
                    },
                    {
                        text: data.includeOutliers ? "Yes" : "No"
                    }
                ]
            }
        ]
    };


    if(restrictionEnzymes[1]){
        table.rows[0].cols.splice(1, 0, {
            text: "Restriction Site #2"
        });

        table.rows[1].cols.splice(1, 0, {
            text: restrictionEnzymes[1].site
        });

    }

    return table;
}




window.deactivateNavRadItems = ()=>{
    let listItems = document.querySelectorAll(".nav-item.rad-item");
    for(let i = 0; i < listItems.length; i++){
        listItems[i].classList.remove("active");
    }
}

window.hideDataTables = ()=>{
    let dataTables = document.querySelectorAll(".rad-data-table");
    for(let i = 0; i < dataTables.length; i++){
        dataTables[i].classList.remove("display-table");
        dataTables[i].classList.add("display-none");
    }
}

window.showTotalData = ()=>{

    hideDataTables();
    document.querySelector("#totalDataTable").classList.add("display-table");


    deactivateNavRadItems();
    document.querySelector("#totalItem").classList.add("active");
}

window.showFocusRangeData = ()=>{
    hideDataTables();
    document.querySelector("#focusRangeDataTable").classList.add("display-table");


    deactivateNavRadItems();
    document.querySelector("#focusRangeItem").classList.add("active");
}

window.showGraphRangeData = ()=>{
    hideDataTables();
    document.querySelector("#graphRangeDataTable").classList.add("display-table");


    deactivateNavRadItems();
    document.querySelector("#graphRangeItem").classList.add("active");
}

window.showInputPropertiesData = ()=>{
    hideDataTables();
    document.querySelector("#inputPropertiesDataTable").classList.add("display-table");


    deactivateNavRadItems();
    document.querySelector("#inputPropertiesItem").classList.add("active");
}


window.displayChart = (fragmentDistributions)=>{
    let chartLabels = [];
    let chartData = [];
    let backgroundColor = [];
    let borderColor = [];

    for(let i = 0; i < fragmentDistributions.length; i++){

        chartLabels.push(fragmentDistributions[i].range);
        chartData.push(`${fragmentDistributions[i].count}`);
        if(fragmentDistributions[i].focusArea){
            backgroundColor.push('rgba(30, 130, 76, 0.2)');
            borderColor.push('rgba(30, 130, 76, 1)');
        } else {
            backgroundColor.push('rgba(54, 162, 235, 0.2)');
            borderColor.push('rgba(54, 162, 235, 1.0)');
        }

    }
    
    fragmentChartObject = new Chart(fragmentChartCanvas, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Fragments',
                data: chartData,
                backgroundColor,
                borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Fragment Length (bp)"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Fragment Count"
                    }
                }
            }
        }
    });
    
}




window.displayTableData = (data)=>{
    document.querySelector("#after-data-hr") ? document.querySelector("#after-data-hr").remove() : null;

    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
    fragmentTableContainer.innerHTML = `

    <nav class="navbar navbar-expand-sm navbar-dark bg-dark rad-navbar-data-tables">
        <a class="navbar-brand rad-navbar-brand-data-tables" href="#">Data Tables</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavData">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse rad-navbar-collapse-data-tables" id="navbarNavData">
            <ul class="navbar-nav">
                <li class="nav-item rad-item active" id="totalItem">
                    <a class="nav-link table-link" href="#" onclick="showTotalData(this)">Total</a>
                </li>
                <li class="nav-item rad-item" id="graphRangeItem">
                    <a class="nav-link table-link" href="#" onclick="showGraphRangeData(this)">Graph Range</a>
                </li>
                <li class="nav-item rad-item" id="focusRangeItem">
                    <a class="nav-link table-link" href="#" onclick="showFocusRangeData(this)">Focus Range</a>
                </li>
                <li class="nav-item rad-item" id="inputPropertiesItem">
                    <a class="nav-link table-link" href="#" onclick="showInputPropertiesData(this)">Input Properties</a>
                </li>
            </ul>
        </div>
    </nav>
    <hr>
    <table class="rad-data-table" id="totalDataTable">
        <tr>
            <th class="rad-th" title="RS Count = Number of Restriction Sites inside Genome File">RS Count</th>
            ${data.digestionType === "double" ? '<th class="rad-th" title="Amount of times restriction site #1 and restriction site #2 overlap">Conflict Sites</th>' : ''}
            <th class="rad-th" title="${data.digestionType === 'single' ? 'Expected RS Slice Count = Total RS Count * Probability' : 'Expected RS Slice Count = (Total RS Count-Conflict Sites*2)*Slice Probability + Conflict Sites*(1-(1-Slice Probability)^2)'}">Expected RS Slice Count</th>
            <th class="rad-th" title="Actual RS Slice Count = Slicing based off of slice probability${data.digestionType === 'double' ? ' and conflicts' : ''}">Actual RS Slice Count</th>
            <th class="rad-th" title="Fragment Count = Actual RS Slice Count + 1">Fragment Count</th>
        </tr>
        <tr>
            <td class="rad-td" id="total_rs_count" title="RS Count = Number of Restriction Sites inside Genome File">${data.totalSiteCount}</td>
            ${data.digestionType === "double" ? '<td class="rad-td" title="Amount of times restriction site #1 and restriction site #2 overlap">' + data.conflicts.toString() + '</td>' : ''}
            <td class="rad-td" id="expected_rs_slice_count" title="${data.digestionType === 'single' ? 'Expected RS Slice Count = Total RS Count * Probability' : 'Expected RS Slice Count = (Total RS Count-Conflict Sites*2)*Slice Probability + Conflict Sites*(1-(1-Slice Probability)^2)'}">${data.expectedSiteCount}</td>
            <td class="rad-td" id="actual_rs_slice_count" title="Actual RS Slice Count = Slicing based off of slice probability${data.digestionType === 'double' ? ' and conflicts' : ''}">${data.actualSiteCount}</td>
            <td class="rad-td" id="fragment_count" title="Fragment Count = Actual RS Slice Count + 1">${data.fragmentCount}</td>
        </tr>
    </table>
    <table class="rad-data-table display-none" id="graphRangeDataTable">
        <tr>
            <th class="rad-th" title="Fragment Count = Amount of fragments in the graph range">Fragment Count</th>
            <th class="rad-th" title="Fragment Percentage = (Fragment Count/Total Fragment Count) * 100">Fragment Percentage</th>
        </tr>
        <tr>
            <td class="rad-td" id="fragment_graph_range_count" title="Fragment Count = Amount of fragments in the graph range">${data.fragmentGraphRangeCount}</td>
            <td class="rad-td" id="fragment_graph_percentage" title="Fragment Percentage = (Fragment Count/Total Fragment Count) * 100">${(((data.fragmentGraphRangeCount)/data.fragmentCount)*100).toString().match(re)[0]}%</td>
        </tr>
    </table>
    <table class="rad-data-table display-none" id="focusRangeDataTable">
        <tr>
            <th class="rad-th" title="Fragment Count = Amount of fragments in the focus range">Fragment Count</th>
            <th class="rad-th" title="Fragment Percentage = (Fragment Count/Total Fragment Count) * 100">Fragment Percentage</th>
        </tr>
        <tr>
            <td class="rad-td" id="fragment_focus_range_count" title="Fragment Count = Amount of fragments in the focus range">${data.fragmentFocusRangeCount}</td>
            <td class="rad-td" id="fragment_focus_range_percentage" title="Fragment Percentage = (Fragment Count/Total Fragment Count) * 100">${(((data.fragmentFocusRangeCount)/data.fragmentCount)*100).toString().match(re)[0]}%</td>
        </tr>
    </table>
    <table class="rad-data-table display-none" id="inputPropertiesDataTable">
        <tr>
            <th class="rad-th">Restriction Site${data.digestionType === 'double' ? ' #1' : ''}</th>
            ${data.digestionType === 'double' ? '<th class="rad-th">Restriction Site #2</th>' : ''}
            <th class="rad-th">Slice Probability</th>
            <th class="rad-th">Graph Range</th>
            <th class="rad-th">Focus Range</th>
            <th class="rad-th">Length Distribution</th>
            <th class="rad-th">Include Outliers</th>
        </tr>
        <tr>
            <td class="rad-td">${data.restrictionSite}</td>
            ${ data.digestionType === 'double' ? `<td class="rad-td">${data.restrictionSite2}</td>` : ''}
            <td class="rad-td">${data.sliceProbability*100}%</td>
            <td class="rad-td">${data.graphRangeMin.toString() + "-" + data.graphRangeMax.toString()}</td>
            <td class="rad-td">${data.focusRangeMin.toString() + "-" + data.focusRangeMax.toString()}</td>
            <td class="rad-td">${data.lengthDistribution}bp</td>
            <td class="rad-td">${data.includeOutliers ? "Yes" : "No"}</td>
        </tr>
    </table>
    <hr>
    `;
    fragmentTableContainer.insertAdjacentHTML("afterend", "<hr id=\"after-data-hr\"");

    $(".nav-link.table-link").on("click", (event)=>{
        event.preventDefault();
        return false;
    });
}
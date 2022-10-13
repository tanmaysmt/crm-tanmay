$(function () {
        var donutChartCanvas = $('#donutChart').get(0).getContext('2d')
        var donutData  = {
        labels: [
            'Pending', 
            'Called', 
        ],
        datasets: [
            {
            data: [700,500],
            backgroundColor : ['#f56954', '#00a65a'],
            }
        ]
    }
    var donutOptions     = {
      maintainAspectRatio : false,
      responsive : true,
    }
    var donutChart = new Chart(donutChartCanvas, {
      type: 'doughnut',
      data: donutData,
      options: donutOptions      
    })
    var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
    var pieData        = donutData;
    var pieOptions     = {
      maintainAspectRatio : false,
      responsive : true,
    }
    var pieChart = new Chart(pieChartCanvas, {
      type: 'pie',
      data: pieData,
      options: pieOptions      
    })
    var barChartData = jQuery.extend(true, {}, donutChartCanvas)
    var temp0 = donutChartCanvas.donutData
    var temp1 = donutChartCanvas.donutData
    barChartData.donutData = temp1
    barChartData.donutData = temp0

    var barChartOptions = {
      responsive              : true,
      maintainAspectRatio     : false,
      datasetFill             : false
    }
})
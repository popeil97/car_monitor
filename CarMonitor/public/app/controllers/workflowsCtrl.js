angular.module('workflowsDirective', ['workflowServices'])

.controller('workflowCtrl', function($scope, Workflow){
    
    $scope.openWorkflows = [];
    $scope.user = {};

    $scope.$on('user-received', function(event, args) {
        var user = args.user;
        console.log(user);
        getOpenWorkflows(user)
    });

    $scope.closeWorkflow = function(workflow) {
        console.log(workflow._id);
        Workflow.closeWorkflow(workflow._id).then(function(res) {
            console.log(res);
            if(res.data.success) {
                workflow.state = "Closed";
            }
            
        });
    }

    $scope.startWorkflow = function(workflow) {
        Workflow.startWorkflow(workflow._id).then(function(res) {
            console.log(res);
            if(res.data.success) {
                workflow.state = "In Progess";
            }
            
        });
    }

    function getOpenWorkflows(user) {
        Workflow.getOpenWorkflows(user.company).then(function(res) {
            var rawWorkflows = res.data.openWorkflows;
            console.log(rawWorkflows);
            rawWorkflows.forEach(function(w) {
                var imageURL = w.imageURL.split('/').pop();
                
                w.imageURL = imageURL;
                console.log(w.imageURL);
            });

            $scope.openWorkflows = rawWorkflows;
        });
    }

})

.directive('workflowDashboard', function() {
    return {
        templateUrl: 'app/views/workflow-dashboard.html',
        controller: 'workflowCtrl'
    };
});
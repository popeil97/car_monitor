angular.module('workflowServices', [])

.factory('Workflow', function($http) {

    let workflowFactory = {};

    workflowFactory.getOpenWorkflows = function(company) {

        let payload = {
            company: company
        };

        return $http.post('/api/workflow', payload);

    }

    workflowFactory.closeWorkflow = function(workflowId) {
        let payload = {
            id: workflowId
        };

        return $http.post('/api/closeWorkflow', payload);
    }

    workflowFactory.startWorkflow = function(workflowId) {
        let payload = {
            id:workflowId
        };

        return $http.post('/api/startWorkflow', payload);
    }

    return workflowFactory;

});
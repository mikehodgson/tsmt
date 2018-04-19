var vm = '';

function sortByName(a,b) {
    if (a.label < b.label)
        return -1;
    if (a.label > b.label)
        return 1;
    return 0;
  }

window.onload = function() {
    Vue.component('v-select', VueSelect.VueSelect);
    vm = new Vue({
        el: '#app',
        data: {
            missions: _DEFAULT_MISSION_DATA.sort(sortByName),
            activeMissions: [],
            selectedMission: null
        },
        mounted : function() {
            this.activeMissions = this.getActiveMissions();
        },
        updated : function() {
            this.saveActiveMissions();
        },
        methods: {
            handleOK: function(evt) {
                if (this.selectedMission != null) {
                    if (!this.hasActiveMission(this.activeMissions, this.selectedMission)) {
                        this.activeMissions.push(this.selectedMission);
                    }
                    this.selectedMission = null;
                }
            },
            getActiveMissions: function() {
                var data = localStorage.getItem('activeMissions');
                if (data != null) {
                    return JSON.parse(data);
                } else {
                    return [];
                }
            },
            saveActiveMissions: function(data) {
                localStorage.setItem('activeMissions', JSON.stringify(this.activeMissions));
            },
            hasActiveMission: function(arr, obj) {
                if (arr.filter(function(e) { return e.value === obj.value; }).length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            requirementIncrease: function(requirement) {
                if (requirement.current < requirement.goal) 
                    requirement.current += 1;
            },
            requirementReset: function(requirement) {
                requirement.current = 0;
            },
            requirementResetAll: function(mission) {
                var requirements = mission.requirements;
                for (let i=0; i < requirements.length; i++) {
                    requirements[i].current = 0;
                }
            },
            isRequirementComplete: function(requirement) {
                if (requirement.current >= requirement.goal) {
                    return true;
                } else {
                    return false;
                }
            },
            isRequirementStarted: function(requirement) {
                if (requirement.current > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            areAllRequirementsComplete: function(mission) {
                var complete = true;
                var requirements = mission.requirements;
                for (let i=0; i < requirements.length; i++) {
                    if (requirements[i].goal > requirements[i].current) {
                        complete = false;
                    }
                }
                return complete;
            },
            removeActiveMission: function(arr, obj) {
                for (let i=0; i < arr.length; i++) {
                    if (arr[i].value == obj.value) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            },
            clearActiveMissions: function() {
                this.activeMissions = [];
            }
        }
    });
}

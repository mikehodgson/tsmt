// Globals

var vm = '';

// Utility functions

function sortByName(a,b) {
    if (a.player < b.player)
        return -1;
    if (a.player > b.player)
        return 1;
    return 0;
}

function copyRecordFromDefault(recordID) {
    var records = vm.$data.missions;
    var record = records.filter(function(e) { return e.id === recordID; })[0];
    record.requirements = copyRequirementsFromDefault(record.id);
    return record;
}

function copyRequirementsFromDefault(recordID) {
    var records = vm.$data.missions;
    var newRequirements = records.filter(function(e) { return e.id === recordID; })[0].requirements.map(function(oldRequirement) {
        return new Requirement(oldRequirement);
    });
    return newRequirements;
}

function updateRequirements(requirementsArray) {
    var newRequirements = [];
    newRequirements = requirementsArray.map(function(oldRequirement) {
        return new Requirement(oldRequirement);
    });
    return newRequirements;
}

function updateRecords(recordArray) {
    // Update old format records, because I'm a nice guy
    var newRecords = [];
    newRecords = recordArray.map(function(oldRecord) {
        if (typeof oldRecord.program_type == 'undefined') {
            var newRecord = copyRecordFromDefault(oldRecord.value);
            newRecord.requirements = updateRequirements(oldRecord.requirements);
            return newRecord;
        } else {
            return oldRecord;
        }
    });
    return newRecords;
}

// Main app

window.onload = function() {
    Vue.component('v-select', VueSelect.VueSelect);
    vm = new Vue({
        el: '#app',
        data: {
            missions: [],
            defaults: null,
            activeMissions: [],
            selectedMission: null
        },
        created : function() {
            var _this = this;
            jQuery.getJSON('js/data/missions.json', function(json) {
                _this.missions = getMissionsFromData(json.missions);
                _this.defaults = json;
            });
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
                        var newRecord = copyRecordFromDefault(this.selectedMission.id);
                        newRecord.requirements = copyRequirementsFromDefault(this.selectedMission.id);
                        this.activeMissions.push(this.selectedMission);
                    }
                    this.selectedMission = null;
                }
            },
            getActiveMissions: function() {
                var data = localStorage.getItem('activeMissions');
                if (data != null) {
                    data = getMissionsFromData(updateRecords(JSON.parse(data)));
                    return data;
                } else {
                    return [];
                }
            },
            saveActiveMissions: function(data) {
                localStorage.setItem('activeMissions', JSON.stringify(this.activeMissions));
            },
            hasActiveMission: function(arr, obj) {
                if (arr.filter(function(e) { return e.id === obj.id; }).length > 0) {
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
                for (var i=0; i < requirements.length; i++) {
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
                for (var i=0; i < requirements.length; i++) {
                    if (requirements[i].goal > requirements[i].current) {
                        complete = false;
                    }
                }
                return complete;
            },
            removeActiveMission: function(arr, obj) {
                for (var i=0; i < arr.length; i++) {
                    if (arr[i].id == obj.id) {
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
};

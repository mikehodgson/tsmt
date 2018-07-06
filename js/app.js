// Globals

var vm = '';

// Main app

window.onload = function() {
    Vue.component('v-select', VueSelect.VueSelect);
    vm = new Vue({
        el: '#app',
        data: {
            missions: [],
            defaults: {version: "0.0.0", last_update: "", missions: [], program_types: [], durations: [], series: [], teams: [], positions: []},
            activeMissions: [],
            editingMission: new Mission({"requirements" : []}),
            selectedMission: null,
            filteredMissions: [],
            selectedFilter: null,
            selectedTeam: null,
			selectedPosition: null
        },
        created : function() {
            var _this = this;
            fetch('js/data/missions.json').then(function(response) {
                response.json().then(function(data) {
                    _this.$data.missions = getMissionsFromData(data.missions).sort(_this.sortByTitle);
                    _this.$data.defaults = {version: data.version, last_update: (data.last_update !== undefined) ? data.last_update : "", program_types: data.program_types, durations: data.durations, series: data.series, teams: data.teams, positions: data.positions};
                    _this.$data.filteredMissions = _this.$data.missions;
                });
            });
        },
        mounted : function() {
            this.$data.activeMissions = this.getActiveMissions();
        },
        updated : function() {
            this.saveActiveMissions();
        },
        watch: {
            selectedFilter: function(newVal) {
                if (newVal != 'Team Epic') {
                    this.$data.selectedTeam = null;
                }
                this.updateProgramFilter(newVal);
            },
            selectedTeam: function(newVal) {
                this.updateTeamFilter(newVal);
            },
			selectedPosition: function(newVal) {
                this.updatePositionFilter(newVal);
			}
        },
        methods: {
            sortByTitle: function(a,b) {
                var titleA = a.title.toLowerCase();
                var titleB = b.title.toLowerCase();
                if (titleA < titleB)
                    return -1;
                if (titleA > titleB)
                    return 1;
                return 0;
            },
            handleSelectedMission: function(evt) {
                var _this = this;
                if (_this.selectedMission != null) {
                    if (!_this.hasActiveMission(_this.activeMissions, _this.selectedMission)) {
                        _this.activeMissions.push(_this.createActiveMission(_this.selectedMission.id));
                    }
                    _this.selectedMission = null;
                }
            },
            handleEditedMission: function(evt) {
                var _this = this;
                _this.$refs.editModal.hide();
                _this.saveActiveMissions();
            },
            getActiveMissions: function() {
                var _this = this;
                var data = localStorage.getItem('CurrentActiveMissions');
                if ((data != null) && (JSON.parse(data).length > 0)) {
                    var missions = JSON.parse(data);
                    return missions.map(function(m) { return _this.updateActiveMission(m); });
                } else {
                    return [];
                }
            },
            updateActiveMission: function(missionData) {
                var _this = this;
                var mission = _this.createActiveMission(missionData.id);
                mission.requirements = _this.updateMissionRequirements(mission, missionData);
                return mission;
            },
            updateMissionRequirements: function(mission, missionData) {
                var _this = this;
                var md =  missionData;
                return mission.requirements.map(function(r) {
                    r.current = missionData.requirements.filter(function(obj) {
                        return obj.requirement_type === r.requirement_type;
                    }).shift().current;
                    return r;
                });
            },
            createActiveMission: function(missionID) {
                var _this = this;
                var mission = _this.missions.filter(function(obj) { return obj.id === missionID; }).shift();
                var newMission = new Mission(mission);
                return newMission;
            },
            saveActiveMissions: function() {
                localStorage.setItem('CurrentActiveMissions', JSON.stringify(this.activeMissions));
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
            },
            editMission: function(mission) {
                var _this = this;
                _this.$data.editingMission = mission;
                _this.$refs.editModal.show();
            },
            createEmptyMission: function() {
                return new Mission({requirements: []});
            },
            updateProgramFilter: function(selectedOption) {
                this.updateFilter();
            },
            updateTeamFilter: function(selectedOption) {
                this.updateFilter();
            },
			updatePositionFilter: function(selectedOption) {
                this.updateFilter();
            },
            updateFilter: function() {
                var _this = this;
                _this.$data.filteredMissions = _this.$data.missions;
                _this.$data.selectedMission = null;
                if (_this.$data.selectedFilter != null) {
                    _this.$data.filteredMissions = _this.$data.filteredMissions.filter(function(e) { return e.program_type === _this.$data.selectedFilter; });
                }
                if (_this.$data.selectedTeam != null) {
                    _this.$data.filteredMissions = _this.$data.filteredMissions.filter(function(e) { return e.team === _this.$data.selectedTeam; });
                }
				if (_this.$data.selectedPosition != null) {
                    _this.$data.filteredMissions = _this.$data.filteredMissions.filter(function(e) { return e.position === _this.$data.selectedPosition; });
                }
            }
        }
    });
};

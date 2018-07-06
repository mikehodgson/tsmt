// Globals

var vm = '';

// Utility functions

function sortByID(a,b) {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
}

// Main app

window.onload = function() {
    Vue.component('v-select', VueSelect.VueSelect);
    vm = new Vue({
        el: '#app',
        data: {
            settings: {},
            missions: [],
            selectedMission: null,
            exportData: ""
        },
        created : function() {
            var _this = this;
            var localData = localStorage.getItem('editMissionSavePoint');
            if (localData != null) {
                _this.$data.missions = getMissionsFromData(JSON.parse(localData)).sort(sortByID);
            }
            fetch('js/data/missions.json').then(function(response) {
                response.json().then(function(data) {
                    _this.$data.missions = getMissionsFromData(data.missions).sort(_this.sortByTitle);
                    _this.$data.settings = {version: data.version, last_update: (data.last_update !== undefined) ? data.last_update : "", program_types: data.program_types, durations: data.durations, series: data.series, teams: data.teams, positions: data.positions};
                });
            });
            _this.$data.selectedMission = _this.createEmptyMission();
        },
        mounted : function() {
        },
        updated : function() {
        },
        methods: {
            getNextID: function() {
                return this.$data.missions[this.$data.missions.length-1].id + 1;
            },
            editRow : function(mission) {
                this.$data.selectedMission = mission;
                this.$refs.addModal.show();
            },
            exportMissions : function() {
                this.$data.exportData = JSON.stringify(this.$data.missions, function(k,v){ if (k != "title" && k != 'current' && k != 'completed') return v;});
            },
            addRow: function() {
                this.$data.selectedMission = this.createEmptyMission(this.getNextID());
                this.$refs.addModal.show();
            },
            addRequirement: function() {
                this.$data.selectedMission.requirements.push(new Requirement({}));
            },
            removeRequirement: function(requirement) {
                this.$data.selectedMission.requirements.splice(this.$data.selectedMission.requirements.indexOf(requirement), 1);
            },
            updateSavePoint: function() {
                localStorage.setItem('editMissionSavePoint', JSON.stringify(this.$data.missions, function(k,v){ if (k != "title" && k != 'current' && k != 'completed') return v;}));
            },
            createEmptyMission: function(nextMissionID) {
                if (nextMissionID !== undefined) {
                    return new Mission({id: nextMissionID, requirements: []});
                } else {
                    return new Mission({requirements: []});
                }
            },
            rowSaved: function() {
                if (this.$data.selectedMission.id == this.getNextID()) {
                    this.$data.missions.push(this.$data.selectedMission);
                }
                this.updateSavePoint();
            }
        }
    });
};

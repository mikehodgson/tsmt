function Requirement(requirementData) {
    var _this = this;
    _this.requirement_type = requirementData.requirement_type || requirementData.name || "";
    _this.goal = requirementData.goal || 0;
    _this.current = requirementData.current || 0;
}

function Mission(missionData) {
    var _this = this;
    _this.createLabel = function() {
        if ((_this.rating == '-') && (_this.series == '-')) {
            return _this.player + ' - ' + _this.program_type + ' - ' + _this.program;
        } else {
            return _this.player + ' (' + _this.rating + '/' + _this.series + '/' + _this.position + ') - ' + _this.program_type + ' - ' + _this.program;
        }
    };

    _this.id = missionData.id || missionData.value || 0;
    _this.player = missionData.player || "";
    _this.rating = missionData.rating || "-";
    _this.series = missionData.series || "-";
    _this.duration = missionData.duration || "";
    _this.team = missionData.team || "";
    _this.position = missionData.position || "-";
    _this.program_type = missionData.program_type || "";
    _this.program = missionData.program || "";
    _this.requirements = missionData.requirements.map(function(r) { return new Requirement(r); });
    _this.label = _this.createLabel();
}

function getMissionsFromData(missionsData) {
    return missionsData.map(function(md) { return new Mission(md); });
}

function createEmptyMission(nextID) {
    var newMission = new Mission({"requirements" : []});
    newMission.id = nextID;
    return newMission;
}

function copyFromDefault(missionID, defaultMissionData) {
    var mission = defaultMissionData.filter(function(obj) { return obj.id === missionID; });
    var newMission = new Mission(mission[0]);
    return newMission;
}

function upgradeOldData(oldRecords) {
    var newRecords = [];
    var defaultMissionData = [];
    console.log('-- upgrading old data');
    jQuery.ajax({
        url: 'js/data/missions.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            defaultMissionData = getMissionsFromData(data.missions);
        }
    });
    for (var i = 0; i < oldRecords.length; i++) {
        console.log('-- old record id: ' + oldRecords[i].value);
        var newRecord = copyFromDefault(oldRecords[i].value, defaultMissionData);
        for (var r = 0; r < oldRecords[i].requirements.length; r++) {
            var newRequirement = newRecord.requirements.filter(function(obj) { return obj.requirement_type === oldRecords[i].requirements[r].name;});
            if (newRequirement.length == 1) {
                newRequirement[0].current = oldRecords[i].requirements[r].current;
            }
        }
        newRecords.push(newRecord);
    }
    localStorage.removeItem("activeMissions");
    return newRecords;
}
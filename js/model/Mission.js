function Requirement(requirementData) {
    this.requirement_type = requirementData.requirement_type;
    this.goal = requirementData.goal;
    this.current = requirementData.current || 0;
}

function Mission(missionData) {
    this.id = missionData.id;
    this.player = missionData.player;
    this.rating = missionData.rating;
    this.series = missionData.series;
    this.duration = missionData.duration;
    this.team = missionData.team;
    this.position = missionData.position;
    this.program_type = missionData.program_type;
    this.program = missionData.program;
    this.requirements = missionData.requirements.map(function(r) { return new Requirement(r); });
    this.label = function() {
        var _this = this;
        return _this.player + ' (' + _this.rating + '/' + _this.series + ') - ' + _this.program_type + ' - ' + _this.program;
    };
}

function getMissionsFromData(missionsData) {
    return missionsData.map(function(md) { return new Mission(md); });
}
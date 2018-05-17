function Requirement(requirementData) {
    var _this = this;
    _this.requirement_type = requirementData.requirement_type || "";
    _this.goal = requirementData.goal || 0;
    _this.current = requirementData.current || 0;
}

function Mission(missionData) {
    var _this = this;
    _this.id = missionData.id || 0;
    _this.player = missionData.player || "";
    _this.rating = missionData.rating || "-";
    _this.series = missionData.series || "-";
    _this.duration = missionData.duration || "";
    _this.team = missionData.team || "";
    _this.position = missionData.position || "-";
    _this.program_type = missionData.program_type || "";
    _this.program = missionData.program || "";
    _this.title = (function() {
        if ((_this.rating == '-') && (_this.series == '-')) {
            return _this.player + ' - ' + _this.program_type + ' - ' + _this.program;
        } else if (_this.player == _this.program) {
            return _this.player + ' (' + _this.rating + '/' + _this.series + '/' + _this.position + ') - ' + _this.program_type;
        } else {
            return _this.player + ' (' + _this.rating + '/' + _this.series + '/' + _this.position + ') - ' + _this.program_type + ' - ' + _this.program;
        }
    })();
    _this.requirements = missionData.requirements.map(function(r) { return new Requirement(r); });
}

function getMissionsFromData(missionsData) {
    return missionsData.map(function(md) {
        return new Mission(md); 
    });
}
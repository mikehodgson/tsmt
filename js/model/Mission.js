function Requirement(requirementData) {
    var _this = this;
    _this.requirement_type = "";
    _this.goal = 0;
    _this.current = 0;

    if (requirementData !== undefined) {
        _this.requirement_type = (requirementData.requirement_type !== undefined) ? requirementData.requirement_type : _this.requirement_type;
        _this.goal = (requirementData.goal !== undefined) ? requirementData.goal : _this.goal;
        _this.current = (requirementData.current !== undefined) ? requirementData.current : _this.current;
    }
}

function Mission(missionData) {
    var _this = this;
    _this.completed = false;
    _this.id = 0;
    _this.player =  "";
    _this.rating = "-";
    _this.series = "-";
    _this.duration = "";
    _this.team = "";
    _this.position = "-";
    _this.program_type = "";
    _this.program = "";
    _this.requirements = [];

    if (missionData !== undefined) {
        _this.completed = (missionData.completed !== undefined) ? missionData.completed : _this.completed;
        _this.id = (missionData.id !== undefined) ? missionData.id : _this.id;
        _this.player = (missionData.player !== undefined) ? missionData.player : _this.player;
        _this.rating = (missionData.rating !== undefined) ? missionData.rating : _this.rating;
        _this.series = (missionData.series !== undefined) ? missionData.series : _this.series;
        _this.duration = (missionData.duration !== undefined) ? missionData.duration : _this.duration;
        _this.team = (missionData.team !== undefined) ? missionData.team : _this.team;
        _this.position = (missionData.position !== undefined) ? missionData.position : _this.position;
        _this.program_type = (missionData.program_type !== undefined) ? missionData.program_type : _this.program_type;
        _this.program = (missionData.program !== undefined) ? missionData.program : _this.program;
        _this.requirements = (missionData.requirements !== undefined) ? missionData.requirements.map(function(r) { return new Requirement(r); }) : _this.requirements;
    }

    _this.title = (function() {
        if ((_this.rating == '-') && (_this.series == '-')) {
            return _this.player + ' - ' + _this.program_type + ' - ' + _this.program;
        } else if (_this.player == _this.program) {
            return _this.player + ' (' + _this.rating + '/' + _this.series + '/' + _this.position + ') - ' + _this.program_type;
        } else {
            return _this.player + ' (' + _this.rating + '/' + _this.series + '/' + _this.position + ') - ' + _this.program_type + ' - ' + _this.program;
        }
    })();
}

function getMissionsFromData(missionsData) {
    return missionsData.map(function(md) {
        return new Mission(md); 
    });
}
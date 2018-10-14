<template>
  <b-modal :id="modalId" size="lg" title="Select Active Missions" backdrop="static" :ok-title="'Done'" :ok-only="true">
    <b-form-row>
      <vue-fuse :threshold=0.4 :distance=50 :minMatchCharLength=2 :tokenize=true :matchAllTokens=true :keys="keys" :list="missions" :defaultAll=true eventName="searchResultsUpdated" @searchResultsUpdated="filterMissions($event)" placeholder="Filter Results" class="w-100 form-control form-control=lg"></vue-fuse>
    </b-form-row>
    <ul class="list-unstyled mb-1 mt-3 pr-3" id="missionList">
      <li v-for="mission in filteredMissions" :mission="mission" :key="mission.id" :class="{'media' : true, 'border' : true, 'rounded' : true, 'mb-2' : true, 'border-success' : hasActiveMission(mission)}" @click="selectMission(mission)">
        <i style="font-size: 1.5em" :class="{'octicon octicon-check ml-2 mt-2' : true, 'text-success' : hasActiveMission(mission), 'text-muted' : !hasActiveMission(mission)}"></i>
        <div class="media-body p-2">
          <h6 class="mt-0 mb-1">{{ getLabel(mission) }}<span class="float-right">{{ mission.duration }}</span></h6>
          <p>Requirements: <span>{{ requirementsToString(mission.requirements) }}</span></p>
        </div>
      </li>
    </ul>
  </b-modal>
</template>
<script>
  export default {
    name: 'MissionSelect',
    props: {
      missions: Array,
      activeMissions: Array,
      modalId: String
    },
    data () {
      return { 
        keys: ["program", "player","team","program_type"], 
        filteredMissions: this.missions 
      }
    },
    methods: {
      getLabel(mission) {
        let label = `${mission.program}`;
        let card_info = '';
        if (mission.program != mission.player) label += ` - ${mission.player}`;
        card_info += (mission.rating != '') ? `${mission.rating}/` : '-/';
        card_info += (mission.series != '') ? `${mission.series}/` : '-/'; 
        card_info += (mission.position != '') ? `${mission.position}` : '-';
        if (card_info != '-/-/-')  label += ` (${card_info})`;
        return label;
      },
      selectMission(mission) {
        if (!this.hasActiveMission(mission))
          this.$eventHub.$emit('mission-selected', mission);
      },
      hasActiveMission(mission) {
        if (this.activeMissions.filter(function(m) { return m.id === mission.id; }).length > 0)
          return true;
        return false;
      },
      requirementsToString(requirements) {
        let result = [];
        requirements.forEach(function(requirement) {
          result.push(requirement.requirement_type + ": " + requirement.goal)
        })
        return result.join(', ')
        //return result;
      },
      filterMissions(result) {
        this.filteredMissions = result;
      }
    }
  }
</script>
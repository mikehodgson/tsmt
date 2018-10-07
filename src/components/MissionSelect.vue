<template>
  <b-modal :id="modalID" size="lg" title="Add Mission" backdrop="static">
    <b-form-row>
      <b-input type="text" class="w-100" placeholder="Filter Results"></b-input>
    </b-form-row>
    <ul class="list-unstyled mb-1 mt-3 pr-3" id="missionList">
      <li v-for="mission in missions" v-bind:mission="mission" v-bind:key="mission.id" class="media border rounded mb-2" @click="selectMission(mission)">
        <img class="mr-3">
        <div class="media-body p-2">
          <h6 class="mt-0 mb-1">{{ getMissionLabel(mission) }}</h6>
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
      modalID: String
    },
    methods: {
      getMissionLabel(mission) {
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
        this.$eventHub.$emit('mission-selected', mission);
      }
    }
  }
</script>
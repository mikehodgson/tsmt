<template>
  <b-modal :id="modalID" size="lg" title="Add Mission" backdrop="static">
    <b-form-row>
      <b-input type="text" class="w-100" placeholder="Filter Results"></b-input>
    </b-form-row>
    <ul class="list-unstyled">
      <li v-for="mission in missions" v-bind:mission="mission" v-bind:key="mission.id" class="media">
        <img class="mr-3">
        <div class="media-body">
          <h5 class="mt-0 mb-1">{{ mission.program }}</h5>
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
      selectedMission: Object,
      modalID: String
    },
  }
</script>
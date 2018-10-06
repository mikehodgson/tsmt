<template>
  <transition name="fade">
    <div class="card mb-2">
      <div class="card-header text-truncate pt-1 pb-1">
        <div class="row pt-0">
          <div class="col-75 text-truncate w-75 mission-label">{{ mission_label }}</div>
          <div class="col-25 w-25 text-right">{{ mission.duration }}</div>
        </div>
      </div>
      <div class="card-body pt-2 pb-2">
        <div class="row">
          <div class="col-75 w-75">
            <requirement v-for="requirement in mission.requirements" v-bind:requirement="requirement" v-bind:key="requirement.id"></requirement>
          </div>
          <div class="col-25 w-25 text-right">
            <b-btn :class="{'ml-2': true, 'mb-1': true, 'float-right' : true, 'btn-success' : areAllRequirementsComplete(), 'btn-danger' : !areAllRequirementsComplete()}" size="md" @click="removeMission()">
              &nbsp;<i :class="{'octicon' : true, 'octicon-check' : areAllRequirementsComplete(), 'octicon-x': !areAllRequirementsComplete()}"></i>
            </b-btn>
            <b-btn :class="{'ml-2': true, 'mb-1': true, 'float-right' : true, 'btn-danger' : true}" size="md" @click="resetRequirements()">
              &nbsp;<i class="octicon octicon-sync"></i>
            </b-btn>
            <b-btn :class="{'float-right' : true, 'btn-secondary' : true}" size="md" @click="editMission()">
              &nbsp;<i class="octicon octicon-pencil"></i>
            </b-btn>
          </div>
        </div>
        <!--
        <div class="row">
          <div class="col-25 w-25 text-right">
            <b-btn :class="{'ml-2': true, 'mb-1': true, 'float-right' : true, 'btn-danger' : true}" size="md" @click="requirementResetAll(mission)">
              &nbsp;<i class="octicon octicon-sync"></i>
            </b-btn>
            <b-btn :class="{'float-right' : true, 'btn-secondary' : true}" size="md" @click="editMission(mission)">
              &nbsp;<i class="octicon octicon-pencil"></i>
            </b-btn>
          </div>
        </div>
        -->
      </div>
    </div>
  </transition>
</template>
<script>
  import Requirement from "../components/Requirement.vue";
  export default {
    name: 'Mission',
    props: {
      mission: Object,
      mission_label: String
    },
    components: {
      Requirement
    },
    methods: {
      removeMission() {
        this.$eventHub.$emit('active-mission-removed', this.mission);
      },
      areAllRequirementsComplete() {
        for (var i = 0; i < this.mission.requirements.length; i++)
        {
          if (this.mission.requirements[i].goal > this.mission.requirements[i].current)
            return false;
        }
        return true;
      },
      resetRequirements() {
        for (var i = 0; i < this.mission.requirements.length; i++)
        {
          this.mission.requirements[i].current = 0;
        }
        this.$eventHub.$emit('active-mission-reset', this.mission);
      }
    }
  }
</script>
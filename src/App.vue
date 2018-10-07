<template>
  <transition name="fade">
    <div id="app" v-cloak>
      <b-container fluid class="pt-3">
        <b-row v-if="missions.active.length == 0">
            <b-col>
                <b-card title="Welcome" class="mb-2">
                        <p class="card-text">Welcome to The Show Mission Tracker. This app uses cookies and local storage to save your settings. Click the <strong>Add Mission</strong> button to get started.</p>
                </b-card>
            </b-col>
        </b-row>
        <mission v-for="mission in missions.active" v-bind:mission="mission" v-bind:key="mission.id" v-bind:mission_label="getMissionLabel(mission)"></mission>
        <b-row class="mb-3">
          <b-col class="mt-3">
            <b-btn v-b-modal="'selectModal'" class="w-100" size="lg" variant="primary">
              Add Mission
            </b-btn>
          </b-col>
          <b-col class="mt-3">
            <b-btn class="w-100" size="lg" variant="secondary" @click="clearActiveMissions()">
              Clear All Missions
            </b-btn>
          </b-col>
        </b-row>
        <b-row id="pageFooter" class="mt-3">
          <b-col>
            <p class="text-center">
              Created by <a href="https://twitter.com/mhodgson">Mike Hodgson</a> | <a href="https://paypal.me/mhodgson">Send a tip</a> | <a href="https://github.com/mikehodgson/tsmt">github</a> | v{{ settings.version }}<br>
              MLB The Show 18 is &copy; 2018 Sony Interactive Entertainment LLC.<br>
              Mission data last updated: {{ settings.last_update }}
            </p>
          </b-col>
        </b-row>
      </b-container>
        <mission-select v-bind:selectedMission="missions.selected" v-bind:modalID="'selectModal'" v-bind:missions="missions.default"></mission-select>
        <!--
        <b-modal id="addModal" size="lg" title="Add Mission" @ok="handleSelectedMission">
          <b-form-row>
            <v-select :options="missions.default" value="id" label="player" :get-option-label="getMissionLabel" v-model="missions.selected" placeholder="Select a player mission..." class="w-100 dark"></v-select>
          </b-form-row>
        </b-modal>
        -->
    </div>
  </transition>
</template>

<script>
import Mission from "./components/Mission.vue";
import MissionSelect from "./components/MissionSelect.vue";
import vSelect from "vue-select";

import SettingsData from "./assets/data/settings.json";
import MissionsData from "./assets/data/missions.json";

export default {
  name: "app",
  data() {
    return {
      settings: SettingsData,
      missions: { default: MissionsData, active: [], selected: null }
    };
  },
  components: {
    Mission,
    MissionSelect,
    vSelect
  },
  created() {
    this.$eventHub.$on('requirement-update', this.persistMissions);
    this.$eventHub.$on('active-mission-reset', this.persistMissions);
    this.$eventHub.$on('active-mission-removed', this.removeMission);
    this.$eventHub.$on('mission-selected', this.handleSelectedMission);
  },
  mounted() {
    if (localStorage.getItem("activeMissions"))
      this.missions.active = JSON.parse(localStorage.getItem("activeMissions"));
  },
  methods: {
    clearActiveMissions() {
      this.missions.active = [];
      this.persistMissions(this.missions.active);
    },
    removeMission(mission) {
      for (var i=0; i < this.missions.active.length; i++) {
          if (this.missions.active[i].id == mission.id) {
              this.missions.active.splice(i, 1);
              break;
          }
      }
      this.persistMissions();
    },
    persistMissions() {
      localStorage.setItem(
        "activeMissions",
        JSON.stringify(this.missions.active)
      );
    },
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
    createActiveMission(mission) {
      for (var i = 0; i < mission.requirements.length; i++)
      {
        this.$set(mission.requirements[i], 'current', 0);
        // mission.requirements[i].current = 0;
      }
      return mission;
    },
    handleSelectedMission(mission) {
      if (mission != null) {
        this.missions.selected = mission;
        if (!this.hasActiveMission(this.missions.active, this.missions.selected)) {
          this.missions.active.push(this.createActiveMission(this.missions.selected));
          this.persistMissions();
        }
      this.missions.selected = null;
      }
    },
    hasActiveMission(active, selected) {
      if (active.filter(function(e) { return e.id === selected.id; }).length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<template>
  <b-btn  :class="{'mb-1' : true, 'mr-2' : true, 'btn-success' : isComplete(), 'btn-warning' : !isComplete()}" size="md"  @click="increment()">
    {{ requirement.requirement_type }} {{ requirement.current }}/{{ requirement.goal }}
  </b-btn>
</template>
<script>
export default {
  name: 'Requirement',
  props: {
    requirement: Object
  },
  methods: {
    increment() {
      if (this.requirement.current < this.requirement.goal)
        this.requirement.current += 1;
      this.$eventHub.$emit('requirement-update', this.requirement);
    },
    isComplete() {
      return this.requirement.current >= this.requirement.goal
    }
  }
}
</script>
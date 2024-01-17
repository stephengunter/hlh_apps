<template>
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="phone"
          :rules="[required]"
          class="mb-2"
          clearable
          label="手機號碼"
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
        登入
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script>
import { LOGIN } from '@/store/actions.type';
  export default {
    data: () => ({
      form: false,
      phone: null
    }),

    methods: {
      onSubmit () {
        if (!this.form) return
        this.$store.dispatch(LOGIN, this.phone)
        .then(() => {
          this.$router.push({ path: '/' })
        })
        .catch(error => {
          console.log(error)
        })
      },
      required (v) {
        return !!v || 'Field is required'
      },
    },
  }
</script>
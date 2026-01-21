<script setup lang="ts">
import { ref, computed } from "vue";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits<{
  close: [result: { extraction: any } | null];
}>();

const form = ref({
  coffeeId: "",
  brewerId: "",
  grinderId: "",
  grinderClicks: 20,
  dose: 20,
  yield: 40,
  time: "0:30",
  rating: 8,
  notes: "",
});

function handleSave(): void {
  emit("close", { extraction: form.value });
}

function handleCancel(): void {
  emit("close", null);
}

const timeInSeconds = computed(() => {
  const [minutes, seconds] = form.value.time.split(":").map(Number);
  const mins = minutes ?? 0;
  const secs = seconds ?? 0;
  return mins * 60 + secs;
});

function updateTimeDisplay(): void {
  const seconds = timeInSeconds.value;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  form.value.time = `${mins}:${secs.toString().padStart(2, "0")}`;
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Log Extraction</h3>
    <div class="space-y-4 py-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Coffee</span>
        </label>
        <select v-model="form.coffeeId" class="select select-bordered w-full">
          <option disabled value="">Select coffee</option>
          <option value="1">Ethiopia Gedeb</option>
          <option value="2">House Blend</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Brewer</span>
          </label>
          <select v-model="form.brewerId" class="select select-bordered w-full">
            <option disabled value="">Select brewer</option>
            <option value="1">V60</option>
            <option value="2">Aeropress</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Grinder</span>
          </label>
          <select
            v-model="form.grinderId"
            class="select select-bordered w-full"
          >
            <option disabled value="">Select grinder</option>
            <option value="1">Baratza Sette 270</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Grinder Clicks</span>
          </label>
          <input
            v-model.number="form.grinderClicks"
            type="number"
            class="input input-bordered w-full"
            min="0"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Time</span>
          </label>
          <input
            v-model="form.time"
            type="text"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Dose (g)</span>
          </label>
          <input
            v-model.number="form.dose"
            type="number"
            class="input input-bordered w-full"
            min="0"
            step="0.1"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Yield (g)</span>
          </label>
          <input
            v-model.number="form.yield"
            type="number"
            class="input input-bordered w-full"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Rating</span>
        </label>
        <div class="rating">
          <input
            v-for="i in 10"
            :key="i"
            type="radio"
            :name="`rating-${Date.now()}`"
            class="mask mask-star-2 bg-orange-400"
            :checked="form.rating === 11 - i"
            @change="form.rating = 11 - i"
          />
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Notes</span>
        </label>
        <textarea
          v-model="form.notes"
          class="textarea textarea-bordered w-full"
          placeholder="Tasting notes, observations..."
          rows="3"
        ></textarea>
      </div>
    </div>

    <div class="modal-action flex justify-between">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary btn-sm" @click="handleSave">Save</button>
    </div>
  </BaseModal>
</template>

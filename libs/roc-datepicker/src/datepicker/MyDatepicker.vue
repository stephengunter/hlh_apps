<template>
  <div
    class="v3dp__datepicker"
    :style="variables($attrs.style)"
  >
    <div class="v3dp__input_wrapper">
      <input
        type="text"
        ref="inputRef"
        :readonly="!typeable"
        v-model="input"
        v-bind="$attrs"
        :placeholder="placeholder"
        :disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        @keyup="keyUp"
        @blur="blur"
        @focus="focus"
        @click="click"
      />
      <div class="v3dp__clearable" v-show="clearable && modelValue">
        <slot name="clear" :onClear="clearModelValue">
          <i @click="clearModelValue()">x</i>
        </slot>
      </div>
    </div>
    <year-picker
      v-show="viewShown === 'year'"
      :pageDate="pageDate"
      @update:pageDate="(v) => updatePageDate('year', v)"
      :selected="modelValue"
      :lowerLimit="lowerLimit"
      :upperLimit="upperLimit"
      @select="selectYear"
    />
    
    <month-picker
      v-show="viewShown === 'month'"
      :pageDate="pageDate"
      @update:pageDate="(v) => updatePageDate('month', v)"
      :selected="modelValue"
      @select="selectMonth"
      :lowerLimit="lowerLimit"
      :upperLimit="upperLimit"
      :format="monthListFormat"
      :locale="locale"
      @back="viewShown = 'year'"
    />
    <day-picker
      v-show="viewShown === 'day'"
      :pageDate="pageDate"
      @update:pageDate="(v) => updatePageDate('day', v)"
      :selected="modelValue"
      :weekStartsOn="weekStartsOn"
      :lowerLimit="lowerLimit"
      :upperLimit="upperLimit"
      :headingFormat="dayPickerHeadingFormat"
      :disabledDates="disabledDates"
      :locale="locale"
      :weekdayFormat="weekdayFormat"
      :allow-outside-interval="allowOutsideInterval"
      :format="dayFormat"
      @select="selectDay"
      @back="viewShown = 'month'"
    />
    <time-picker
      v-show="viewShown === 'time'"
      :pageDate="pageDate"
      :visible="viewShown === 'time'"
      :selected="modelValue"
      :disabledTime="disabledTime"
      @select="selectTime"
      @back="goBackFromTimepicker"
    />
  </div>
</template>
<script>
import { defineComponent, ref, computed, watchEffect } from 'vue';
import { parse, isValid, format, max, min } from 'date-fns';
import YearPicker from './YearPicker.vue';
import MonthPicker from './MonthPicker.vue';
import DayPicker from './DayPicker.vue';
import TimePicker from './Timepicker.vue';

const TIME_RESOLUTIONS = ['time', 'day', 'month', 'year'];

const boundedDate = (lower, upper, target = undefined) => {
  let date = target || new Date();

  if (lower) date = max([lower, date]);
  if (upper) date = min([upper, date]);

  return date;
};

export default defineComponent({
  components: {
    YearPicker,
    MonthPicker,
    DayPicker,
    TimePicker,
  },
  inheritAttrs: false,
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Date,
      required: false,
    },
    disabledDates: {
      type: Object,
      required: false,
    },
    allowOutsideInterval: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabledTime: {
      type: Object,
      required: false,
    },
    upperLimit: {
      type: Date,
      required: false,
    },
    lowerLimit: {
      type: Date,
      required: false,
    },
    startingView: {
      type: String,
      required: false,
      default: 'day',
      validator: (v) => typeof v === 'string' && TIME_RESOLUTIONS.includes(v),
    },
    startingViewDate: {
      type: Date,
      required: false,
      default: () => new Date(),
    },
    dayPickerHeadingFormat: {
      type: String,
      required: false,
      default: 'LLLL yyyy',
    },
    monthListFormat: {
      type: String,
      required: false,
      default: 'LLL',
    },
    weekdayFormat: {
      type: String,
      required: false,
      default: 'EE',
    },
    dayFormat: {
      type: String,
      required: false,
      default: 'dd',
    },
    inputFormat: {
      type: String,
      required: false,
      default: 'yyyy-MM-dd',
    },
    locale: {
      type: Object,
      required: false,
    },
    weekStartsOn: {
      type: Number,
      required: false,
      default: 1,
      validator: (value) => [0, 1, 2, 3, 4, 5, 6].includes(value),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    typeable: {
      type: Boolean,
      required: false,
      default: false,
    },
    minimumView: {
      type: String,
      required: false,
      default: 'day',
      validator: (v) => typeof v === 'string' && TIME_RESOLUTIONS.includes(v),
    },
  },
  emits: {
    'update:modelValue': (value) => value === null || value === undefined || isValid(value),
    decadePageChanged: (pageDate) => true,
    yearPageChanged: (pageDate) => true,
    monthPageChanged: (pageDate) => true,
    opened: () => true,
    closed: () => true,
  },
  setup(props, { emit, attrs }) {
    const viewShown = ref('none');
    const pageDate = ref(props.startingViewDate);
    const inputRef = ref(null);
    const isFocused = ref(false);

    const input = ref('');
    watchEffect(() => {
      const parsed = parse(input.value, props.inputFormat, new Date(), {
        locale: props.locale,
      });
      if (isValid(parsed)) {
        pageDate.value = parsed;
      }
    });

    watchEffect(() => {
      input.value = props.modelValue && isValid(props.modelValue)
        ? format(props.modelValue, props.inputFormat, { locale: props.locale })
        : '';
    });

    const renderView = (view) => {
      if (!props.disabled) {
        if (view !== 'none' && viewShown.value === 'none') {
          pageDate.value = props.modelValue ||
            boundedDate(props.lowerLimit, props.upperLimit, pageDate.value);
        }
        viewShown.value = view;
        emit(view !== 'none' ? 'opened' : 'closed');
      }
    };

    watchEffect(() => {
      if (props.disabled) viewShown.value = 'none';
    });

    const updatePageDate = (view, newPageDate) => {
      pageDate.value = newPageDate;
      if (view === 'year') emit('decadePageChanged', newPageDate);
      else if (view === 'month') emit('yearPageChanged', newPageDate);
      else if (view === 'day') emit('monthPageChanged', newPageDate);
    };

    const selectYear = (date) => {
      pageDate.value = date;
      if (props.minimumView === 'year') {
        renderView('none');
        emit('update:modelValue', date);
      } else {
        viewShown.value = 'month';
      }
    };

    const selectMonth = (date) => {
      pageDate.value = date;
      if (props.minimumView === 'month') {
        renderView('none');
        emit('update:modelValue', date);
      } else {
        viewShown.value = 'day';
      }
    };

    const selectDay = (date) => {
      pageDate.value = date;
      if (props.minimumView === 'day') {
        renderView('none');
        emit('update:modelValue', date);
      } else {
        viewShown.value = 'time';
      }
    };

    const selectTime = (date) => {
      renderView('none');
      emit('update:modelValue', date);
    };

    const clearModelValue = () => {
      if (props.clearable) {
        renderView('none');
        emit('update:modelValue', null);
        pageDate.value = props.startingViewDate;
      }
    };

    const click = () => isFocused.value = true;
    const focus = () => renderView(initialView.value);
    const blur = () => {
      isFocused.value = false;
      renderView();
    };

    const keyUp = (event) => {
      const code = event.keyCode ? event.keyCode : event.which;
      const closeButton = [27, 13].includes(code);
      if (closeButton) inputRef.value.blur();
      if (props.typeable) {
        const parsedDate = parse(inputRef.value.value, props.inputFormat, new Date(), { locale: props.locale });
        if (isValid(parsedDate) &&
          input.value === format(parsedDate, props.inputFormat, { locale: props.locale })) {
          input.value = inputRef.value.value;
          emit('update:modelValue', parsedDate);
        }
      }
    };

    const initialView = computed(() => {
      const startingViewOrder = TIME_RESOLUTIONS.indexOf(props.startingView);
      const minimumViewOrder = TIME_RESOLUTIONS.indexOf(props.minimumView);

      return startingViewOrder < minimumViewOrder
        ? props.minimumView
        : props.startingView;
    });

    const variables = (object) =>
      Object.fromEntries(
        Object.entries(object ?? {}).filter(([key, _]) => key.startsWith('--'))
      );

    const goBackFromTimepicker = () =>
      props.startingView === 'time' && props.minimumView === 'time'
        ? null
        : (viewShown.value = 'day');

    return {
      blur,
      focus,
      click,
      input,
      inputRef,
      pageDate,
      renderView,
      updatePageDate,
      selectYear,
      selectMonth,
      selectDay,
      selectTime,
      keyUp,
      viewShown,
      goBackFromTimepicker,
      clearModelValue,
      initialView,
      log: (e) => console.log(e),
      variables,
    };
  },
});


</script>

<style>
.v3dp__datepicker {
  --popout-bg-color: var(--vdp-bg-color, #fff);
  --box-shadow: var(
    --vdp-box-shadow,
    0 4px 10px 0 rgba(128, 144, 160, 0.1),
    0 0 1px 0 rgba(128, 144, 160, 0.81)
  );
  --text-color: var(--vdp-text-color, #000000);
  --border-radius: var(--vdp-border-radius, 3px);
  --heading-size: var(--vdp-heading-size, 2.5em); /* 40px for 16px font */
  --heading-weight: var(--vdp-heading-weight, bold);
  --heading-hover-color: var(--vdp-heading-hover-color, #eeeeee);
  --arrow-color: var(--vdp-arrow-color, currentColor);

  --elem-color: var(--vdp-elem-color, currentColor);
  --elem-disabled-color: var(--vdp-disabled-color, #d5d9e0);
  --elem-hover-color: var(--vdp-hover-color, #fff);
  --elem-hover-bg-color: var(--vdp-hover-bg-color, #0baf74);
  --elem-selected-color: var(--vdp-selected-color, #fff);
  --elem-selected-bg-color: var(--vdp-selected-bg-color, #0baf74);

  --elem-current-outline-color: var(--vdp-current-date-outline-color, #888);
  --elem-current-font-weight: var(--vdp-current-date-font-weight, bold);

  --elem-font-size: var(--vdp-elem-font-size, 0.8em);
  --elem-border-radius: var(--vdp-elem-border-radius, 3px);

  --divider-color: var(--vdp-divider-color, var(--elem-disabled-color));

  position: relative;
}

.v3dp__clearable {
  display: inline;
  position: relative;
  left: -15px;
  cursor: pointer;
}
</style>

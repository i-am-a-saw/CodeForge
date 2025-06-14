

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const state = ref('input'); // input, generating, result
    const code = ref('');
    const gapCount = ref(1);
    const error = ref('');
    const taskId = ref(null);
    const result = ref({
      taskId: '',
      gappedCode: '',
      alias: ''
    });
    let pollingInterval = null;

    const taskLink = computed(() => {
      return `${window.location.origin}/task/${result.value.alias}`;
    });

    const startGeneration = async () => {
      if (!code.value || gapCount.value < 1) {
        error.value = 'Пожалуйста, заполните все поля';
        return;
      }

      try {
        error.value = '';
        state.value = 'generating';

        // Шаг 1: Отправка кода на генерацию
        const response = await fetch('https://api.codular.ru/api/v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code.value,
            gapCount: gapCount.value
          }),
        });

        if (!response.ok) throw new Error('Ошибка сервера');

        const { taskId: id } = await response.json();
        taskId.value = id;

        // Шаг 2: Периодическая проверка статуса
        pollingInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(
                `https://api.codular.ru/api/v1/${taskId.value}`
            );
            const { status, alias } = await statusResponse.json();

            if (status === 'Done') {
              clearInterval(pollingInterval);

              // Шаг 3: Получение готовой задачи
              const taskResponse = await fetch(
                  `https://api.codular.ru/api/v1/${alias}`
              );
              const taskData = await taskResponse.json();

              result.value = {
                taskId: taskId.value,
                gappedCode: taskData.gappedCode,
                alias: alias
              };
              state.value = 'result';
            }
          } catch (err) {
            clearInterval(pollingInterval);
            error.value = 'Ошибка при проверке статуса';
            state.value = 'input';
          }
        }, 2000);
      } catch (err) {
        error.value = 'Ошибка при генерации задачи';
        state.value = 'input';
      }
    };

    const reset = () => {
      state.value = 'input';
      code.value = '';
      gapCount.value = 1;
      error.value = '';
      taskId.value = null;
      result.value = {
        taskId: '',
        gappedCode: '',
        alias: ''
      };
      clearInterval(pollingInterval);
    };

    return {
      state,
      code,
      gapCount,
      error,
      result,
      taskLink,
      startGeneration,
      reset
    };
  }
};
</script>

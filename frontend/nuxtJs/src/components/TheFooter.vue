<template>
    <section class="hero section is-block is-relative is-white is-medium">
        <div class="container">
            <div class="columns">
                <div class="column is-5 is-5-widescreen">
                    <p>
                        <strong>TODO LIST</strong>
                        <br>
                        Версия <a href="https://github.com/bogachevskes/todo-skill-up/releases">{{ $config.APP_VERSION }}</a>
                        <br>
                        <a href="https://github.com/bogachevskes" target="_blank">Разработчик Андрей Богачевский</a>
                        <br>
                        <a href="http://opensource.org/licenses/mit-license.php" target="_blank">Лицензия MIT</a>
                        <br>
                        <a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                            Контент сайта лицензирован CC BY NC SA 4.0
                        </a>
                        <br>
                        <a target="_blank" href="/terms">Условия пользования сервисом</a>
                        <br>
                        <a target="_blank" href="/swagger-ui">Документация API</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'TheFooter',
};
</script>

<style></style>

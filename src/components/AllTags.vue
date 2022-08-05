<template>
  <article>
    <div class="header-search">
      <div class="title-container">
        <div class="sort">
          <p>Tags</p>
          <span class="material-symbols-outlined sort-icon"> sort </span>
        </div>
        <div class="sort-type">
          <p>A-Z</p>
          <p>Random</p>
        </div>
      </div>
      <div class="search-container">
        <input type="text" placeholder="Search for a tag" />
        <p>Search</p>
      </div>
    </div>
    <div class="tags-container">
      <p>london</p>
      <p>nature</p>
      <p>trip</p>
      <p>burger place</p>
      <p>renovation</p>
      <p>concert</p>
      <p>tent</p>
      <p>new date</p>
      <p>carribean</p>
      <p>boat</p>
      <p>holiday</p>
      <p>new yotk</p>
      <p>universe</p>
      <p>business</p>
      <p>dream</p>
      <p>orchestra</p>
      <p>camera</p>
      <p>film</p>
      <p>ocean</p>
      <p>pub</p>
      <p>italy</p>
      <p>china</p>
      <p>spagetti</p>
      <p>chicken</p>
      <p>cream</p>
      <p>book</p>
      <p>tim</p>
      <p>odeon</p>
      <p>cinema</p>
      <p>keyboard</p>
      <p>angles</p>
      <p>festival</p>
      <p>shine</p>
      <p>engament</p>
      <p>granny</p>
    </div>
  </article>
</template>

<script>
export default {
  setup() {},
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

article {
  height: 100%;
  width: 100%;
  padding: 10px;
  border-radius: $radius-big;
  color: $h2;
  background-color: $background-tag-container-blue;
  .header-search {
    margin-bottom: 7px;
    .title-container {
      margin-bottom: 25px;
      position: relative;
      display: flex;
      align-items: center;
      .sort {
        display: flex;
        margin-right: 10px;
        align-items: center;
        p {
          margin-right: 7px;
          color: darken($h2, 10%);
        }
        .sort-icon {
          font-size: 19px;
          color: darken($h2, 10%);
          cursor: pointer;
          &:hover {
            color: darken($h2, 40%);
          }
        }
      }
      .sort-type {
        display: flex;
        align-items: center;
        font-size: 13px;
        p {
          padding: 3px 15px;
          margin-right: 5px;
          border-radius: $radius-big;
          background-color: $background;
          cursor: pointer;
        }
      }
    }
    .search-container {
      position: relative;
      input {
        border: unset;
        width: 100%;
        font-size: 14px;
        background-color: unset;
        padding-bottom: 2px;
        color: $main-text;
        border-bottom: 1px solid $input-line;
        &::placeholder {
          color: $placeholder-border;
        }
        &:focus {
          position: relative;
          outline: unset;
          border-bottom: 1px solid #7d9ca6;
          box-shadow: inset 0 -1px #7d9ca6;
        }
      }
      p {
        position: absolute;
        right: 0;
        bottom: 5px;
        font-family: $ff;
        padding: 1px 10px;
        border-radius: 5px;
        font-size: 12px;
        color: darken($placeholder-border, 10%);
        background-color: transparent;
        border: 2px solid $placeholder-border;
        cursor: pointer;
      }
    }
  }
  .tags-container {
    height: 200px;
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    @include scrollbar;
    &::-webkit-scrollbar-track {
      margin-top: unset;
      margin-bottom: unset;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $tag-thumb-blue;
      border-radius: 100vw;
      border: 3px solid $background-tag-container-blue;
    }
    p {
      width: fit-content;
      font-size: clamp(11px, 3vw, 13px);
      padding: 3px 10px;
      border-radius: $radius-tag;
      color: $tag-text;
      background-color: $background-tag-blue;
      cursor: pointer;
      &:hover {
        background-color: darken($main-tag-background, 10%);
      }
    }
  }
  @include mobile-end {
    .tags-container {
    }
  }
  @include desktop-size {
    .tags-container {
      height: 136px;
    }
  }
}
</style>

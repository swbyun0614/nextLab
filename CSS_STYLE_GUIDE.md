# CSS 속성 정리 규칙

CSS 코드 작성 시 다음 순서로 속성을 정리합니다.

## 속성 순서

### 1. Position 관련 (첫 번째 줄)
- `position`, `top`, `right`, `bottom`, `left`, `z-index`

### 2. Display 관련 (두 번째 줄)
- `display`, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap` 등

### 3. 나머지 속성 (마지막 줄)
- **width, height를 가장 먼저 작성**
- 이후 `margin`, `padding`, `background`, `border`, `font`, `color` 등

## 예시

```css
.example {
  position: absolute; top: 0; left: 0; z-index: 10;
  display: flex; justify-content: center; align-items: center;
  width: 100%; height: 50px; margin: 0; padding: 10px; background: #fff;
}
```

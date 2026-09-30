import classes from '../../styles/Loading.module.scss';

const RADIUS = 40;
const DOT_SIZE = 15;
const DOT_COUNT = 8;
const DURATION = 1;

const Loading = () => (
  <div className={classes.spinner} role="status" aria-label="Loading">
    {Array.from({ length: DOT_COUNT }, (_, index) => {
      const angle = index * (360 / DOT_COUNT);
      return (
        <span
          key={index}
          className={classes.dot}
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            transform: `rotate(${angle}deg) translateY(-${RADIUS}px)`,
            animationDelay: `${-(index * (DURATION / DOT_COUNT))}s`,
          }}
        />
      );
    })}
  </div>
);

export default Loading;

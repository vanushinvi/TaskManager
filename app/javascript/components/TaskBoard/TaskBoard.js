import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';

import Task from 'components/Task';
import TasksRepository from 'repositories/TasksRepository';
import ColumnHeader from 'components/ColumnHeader';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddPopup from 'components/AddPopup';
import TaskForm from 'forms/TaskForm';
import useStyles from './useStyles';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const MODES = {
  ADD: 'add',
  NONE: 'none',
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

const TaskBoard = () => {
  const styles = useStyles();
  const [mode, setMode] = useState(MODES.NONE);
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => {
        const { cards } = prevState[state];
        return {
          ...prevState,
          [state]: {
            cards: [...cards, ...data.items],
            meta: data.meta,
          },
        };
      });
    });
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const generateBoard = () => {
    const board = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };

    setBoard(board);
  };

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(task.state);
      handleClose();
    });
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };
  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  return (
    <>
      <KanbanBoard
        renderCard={(card) => <Task task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        onCardDragEnd={handleCardDragEnd}
      >
        {board}
      </KanbanBoard>

      <Fab onClick={handleOpenAddPopup} className={styles.addButton} color="primary" aria-label="add">
        <AddIcon />
        {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} />}
      </Fab>
    </>
  );
};

export default TaskBoard;

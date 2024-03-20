import { useEffect } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import ListIcon from '@/awesome-icons/solid/list-ul.svg?react';
import { fetchLists } from 'flavours/polyam/actions/lists';

import ColumnLink from './column_link';

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title'))).take(4);
});

export const ListPanel = () => {
  const dispatch = useDispatch();
  const lists = useSelector(state => getOrderedLists(state));

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  if (!lists || lists.isEmpty()) {
    return null;
  }

  return (
    <div className='list-panel'>
      <hr />
      {lists.map(list => (
        <ColumnLink icon='list-ul' key={list.get('id')} iconComponent={ListIcon} text={list.get('title')} to={`/lists/${list.get('id')}`} transparent />
      ))}
    </div>
  );
};
